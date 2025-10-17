// src/pages/Meeting.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../services/socket";
import VideoGrid from "../components/VideoGrid";
import Controls from "../components/Controls.jsx";
import ChatPanel from "../components/ChatPanel";

const STUN_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

export default function Meeting() {
  const { id: meetingId } = useParams();
  const localVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState({}); // { socketId: { pc, stream, user } }
  const pcsRef = useRef({}); // mutable map of RTCPeerConnection objects
  const [participants, setParticipants] = useState([]); // list of { socketId, user }
  const [chatMessages, setChatMessages] = useState([]);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  // get local media
  useEffect(() => {
    let mounted = true;
    async function startLocal() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        if (!mounted) return;
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Could not get user media", err);
        alert("Please allow camera/microphone access.");
      }
    }
    startLocal();
    return () => { mounted = false; };
  }, []);

  // Socket handlers + join
  useEffect(() => {
    if (!meetingId) return;

    // connect socket
    socket.connect();

    const user = { name: "Guest-" + Math.floor(Math.random() * 1000) };
    socket.emit("join-meeting", { meetingId, user });

    socket.on("meeting-participants", (list) => {
      // list contains existing participants (including ourselves maybe)
      // Filter out ourselves if present
      const others = list.filter(p => p.socketId !== socket.id);
      setParticipants(others);
      // For each existing participant, create an offer (we will call createOffer)
      others.forEach(p => {
        createOfferTo(p.socketId, p.user);
      });
    });

    socket.on("user-joined", ({ socketId, user }) => {
      // someone joined after us; store and wait for its offer or create one
      setParticipants(prev => {
        if (prev.find(x => x.socketId === socketId)) return prev;
        return [...prev, { socketId, user }];
      });
      // If we already have localStream, notify them by creating offer
      // We'll create an offer to the new user.
      createOfferTo(socketId, user);
    });

    socket.on("webrtc-offer", async ({ from, sdp, fromUser }) => {
      // Receive offer from a peer -> create pc, set remote desc, create answer
      if (pcsRef.current[from]) {
        console.warn("Already have pc for", from);
      }

      const pc = createPeerConnection(from);
      pcsRef.current[from] = pc;

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("webrtc-answer", { to: from, sdp: pc.localDescription });
      } catch (err) {
        console.error("Error handling offer", err);
      }
    });

    socket.on("webrtc-answer", async ({ from, sdp }) => {
      const pc = pcsRef.current[from];
      if (!pc) {
        console.warn("No pc found for answer from", from);
        return;
      }
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      } catch (err) {
        console.error("Error setting remote description (answer):", err);
      }
    });

    socket.on("ice-candidate", async ({ from, candidate }) => {
      const pc = pcsRef.current[from];
      if (!pc) return;
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding remote ICE candidate", err);
      }
    });

    socket.on("chat-message", ({ message, user, timestamp }) => {
      setChatMessages(prev => [...prev, { message, user, timestamp }]);
    });

    // cleanup on leave
    return () => {
      socket.off("meeting-participants");
      socket.off("user-joined");
      socket.off("webrtc-offer");
      socket.off("webrtc-answer");
      socket.off("ice-candidate");
      socket.off("chat-message");
      socket.disconnect();

      // close peer connections
      Object.values(pcsRef.current).forEach(pc => {
        try { pc.close(); } catch (e) {}
      });
      pcsRef.current = {};
      setPeers({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingId, localStream]);

  // Helper: create RTCPeerConnection and wire handlers
  function createPeerConnection(remoteSocketId) {
    const pc = new RTCPeerConnection({ iceServers: STUN_SERVERS });

    // add local tracks
    if (localStream) {
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    }

    // when remote track arrives
    const remoteStream = new MediaStream();
    pc.ontrack = (ev) => {
      ev.streams?.[0]?.getTracks().forEach(t => remoteStream.addTrack(t));
      setPeers(prev => ({
        ...prev,
        [remoteSocketId]: { ...(prev[remoteSocketId] || {}), stream: remoteStream }
      }));
    };

    // ice candidates -> send to remote
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", { to: remoteSocketId, candidate: e.candidate });
      }
    };

    // connection state
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed" || pc.connectionState === "disconnected" || pc.connectionState === "closed") {
        // remove peer
        setPeers(prev => {
          const copy = { ...prev };
          delete copy[remoteSocketId];
          return copy;
        });
        if (pcsRef.current[remoteSocketId]) {
          try { pcsRef.current[remoteSocketId].close(); } catch (e) {}
          delete pcsRef.current[remoteSocketId];
        }
      }
    };

    // Save basic meta
    setPeers(prev => ({
      ...prev,
      [remoteSocketId]: { ...(prev[remoteSocketId] || {}), pc, stream: remoteStream }
    }));

    return pc;
  }

  // Create offer to a remote peer
  async function createOfferTo(remoteSocketId, remoteUser) {
    // Avoid duplicate pc
    if (pcsRef.current[remoteSocketId]) return;

    const pc = createPeerConnection(remoteSocketId);
    pcsRef.current[remoteSocketId] = pc;

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("webrtc-offer", { to: remoteSocketId, sdp: pc.localDescription, fromUser: { name: "me" } });
    } catch (err) {
      console.error("Error creating offer", err);
    }
  }

  // Controls: mute/unmute
  function toggleMute() {
    if (!localStream) return;
    const audioTracks = localStream.getAudioTracks();
    audioTracks.forEach(t => t.enabled = !t.enabled);
    setMuted(audioTracks.length > 0 ? !audioTracks[0].enabled : false);
  }

  // Controls: toggle camera
  function toggleCamera() {
    if (!localStream) return;
    const videoTracks = localStream.getVideoTracks();
    videoTracks.forEach(t => t.enabled = !t.enabled);
    setCameraOff(videoTracks.length > 0 ? !videoTracks[0].enabled : false);
  }

  // Screen share
  async function startScreenShare() {
    if (!navigator.mediaDevices.getDisplayMedia) {
      alert("Screen sharing not supported in this browser.");
      return;
    }
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];

      // replace each pc's sender track for video
      Object.values(pcsRef.current).forEach(pc => {
        const senders = pc.getSenders().filter(s => s.track && s.track.kind === "video");
        if (senders.length) {
          senders[0].replaceTrack(screenTrack).catch(err => console.warn("replaceTrack failed", err));
        }
      });

      // when user stops screen share, revert to camera
      screenTrack.onended = () => {
        // revert to camera track
        if (!localStream) return;
        const camTrack = localStream.getVideoTracks()[0];
        if (!camTrack) return;
        Object.values(pcsRef.current).forEach(pc => {
          const senders = pc.getSenders().filter(s => s.track && s.track.kind === "video");
          if (senders.length) {
            senders[0].replaceTrack(camTrack).catch(err => console.warn("replaceTrack revert failed", err));
          }
        });
      };
    } catch (err) {
      console.error("Screen share error:", err);
    }
  }

  // Send chat
  function sendChat(message) {
    if (!message?.trim()) return;
    socket.emit("chat-message", { meetingId, message, user: { name: "Me" } });
    setChatMessages(prev => [...prev, { message, user: { name: "Me" }, timestamp: Date.now() }]);
  }

  // Render
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 p-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg mb-2">Meeting: {meetingId}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <VideoGrid
                localVideoRef={localVideoRef}
                localStream={localStream}
                peers={peers}
              />
            </div>

            <div className="space-y-4">
              <Controls
                muted={muted}
                cameraOff={cameraOff}
                onToggleMute={toggleMute}
                onToggleCamera={toggleCamera}
                onScreenShare={startScreenShare}
              />
              <ChatPanel messages={chatMessages} onSend={sendChat} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
