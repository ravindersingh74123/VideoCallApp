import React, { useEffect, useRef, useState, useMemo } from "react";

export default function VideoGrid({
  localVideoRef,
  peers = {},
  participants,
  user,
  muted,
  cameraOff,
}) {
  const peerEntries = useMemo(
    () =>
      Object.entries(peers).filter(
        ([, p]) => p && p.stream && p.stream.getTracks().length > 0
      ),
    [peers]
  );

  const totalParticipants = 1 + peerEntries.length;

  const AUTO_STACK_THRESHOLD = 7;

  const [forceView, setForceView] = useState(null);
  const inferredStack = totalParticipants >= AUTO_STACK_THRESHOLD;
  const isStackView =
    forceView === "stack" || (forceView === null && inferredStack);

  const getGridClass = (count) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    if (count <= 4) return "grid-cols-2";
    if (count <= 9) return "grid-cols-3";
    return "grid-cols-4";
  };

  return (
    <div className="flex-1 h-full min-h-0 min-w-0 bg-[#1E1E1E] rounded-xl p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-200">
          Participants: <span className="font-medium">{totalParticipants}</span>
        </div>

        <div className="flex items-center gap-2"></div>
      </div>

      <div className="flex-1 min-h-0">
        {isStackView ? (
          <div className="h-full flex flex-col gap-4 min-h-0">
            <div className="w-full flex-shrink-0">
              <LocalTile
                localVideoRef={localVideoRef}
                user={user}
                muted={muted}
                cameraOff={cameraOff}
              />
            </div>

            <div
              className="w-full flex-1 overflow-y-auto pr-2 min-h-0"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div className="flex flex-col gap-4">
                {peerEntries.map(([socketId, peerData]) => (
                  <div key={socketId} className="flex-shrink-0">
                    <PeerTileStack
                      socketId={socketId}
                      stream={peerData.stream}
                      name={peerData.user?.name || "Participant"}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`grid ${getGridClass(
              totalParticipants
            )} gap-4 place-items-center overflow-y-auto pr-2 h-full min-h-0 min-w-0`}
            style={{
              WebkitOverflowScrolling: "touch",
              alignContent: "start",
              gridAutoRows: "1fr",
            }}
          >
            <div className="bg-black rounded-lg relative overflow-hidden w-full h-full">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover scale-x-[-1]"
              />
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-sm px-2 py-1 rounded-md flex items-center gap-2">
                <span className="font-medium">{user?.name || "You"}</span>
                <span className="text-xs text-gray-300">(You)</span>
                {muted && <span className="text-red-500 font-bold">●</span>}
                {cameraOff && (
                  <span className="ml-1 text-yellow-300 text-xs">cam off</span>
                )}
              </div>
            </div>

            {peerEntries.map(([socketId, peerData]) => (
              <PeerTileGrid
                key={socketId}
                socketId={socketId}
                stream={peerData.stream}
                name={peerData.user?.name || "Participant"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleButton({ active, onClick, label, title }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-md text-sm focus:outline-none ${
        active
          ? "bg-gray-700 text-white"
          : "bg-black/40 text-gray-200 hover:bg-black/60"
      }`}
      aria-pressed={active}
      title={title}
    >
      {label}
    </button>
  );
}

function LocalTile({ localVideoRef, user, muted, cameraOff }) {
  return (
    <div className="bg-black rounded-lg relative overflow-hidden w-full h-56 md:h-64">
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover scale-x-[-1]"
      />
      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-sm px-2 py-1 rounded-md flex items-center gap-2">
        <span className="font-medium">{user?.name || "You"}</span>
        <span className="text-xs text-gray-300">(You)</span>
        {muted && <span className="text-red-500 font-bold">●</span>}
        {cameraOff && (
          <span className="ml-1 text-yellow-300 text-xs">cam off</span>
        )}
      </div>
    </div>
  );
}

function PeerTileGrid({ socketId, stream, name }) {
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [userMutedAudio, setUserMutedAudio] = useState(false);

  useEffect(() => {
    const videoNode = videoRef.current;
    if (!videoNode || !stream) return;

    const videoTracks = stream.getVideoTracks() || [];
    const hasActiveVideo =
      videoTracks.length > 0 &&
      videoTracks.some((t) => t.readyState !== "ended" && t.enabled);
    setCameraActive(Boolean(hasActiveVideo));

    videoNode.srcObject = stream;

    let cancelled = false;
    const attemptPlay = async (tryMuted = false) => {
      if (cancelled) return;
      try {
        videoNode.muted = !!tryMuted || userMutedAudio;
        const p = videoNode.play();
        if (p !== undefined) {
          await p;
          if (!tryMuted) setAudioBlocked(false);
          else setAudioBlocked(true);
        }
      } catch (err) {
        if (!tryMuted) return attemptPlay(true);
        else setAudioBlocked(true);
      }
    };

    attemptPlay(false);

    const onTrackChange = () => {
      const vt = stream.getVideoTracks() || [];
      const hasVid = vt.some((t) => t.readyState !== "ended" && t.enabled);
      setCameraActive(Boolean(hasVid));
      attemptPlay(false);
    };

    stream.getTracks().forEach((track) => {
      track.onunmute = onTrackChange;
      track.onended = onTrackChange;
      track.onmute = onTrackChange;
    });

    return () => {
      cancelled = true;
      try {
        if (videoNode) {
          videoNode.pause();
          videoNode.srcObject = null;
        }
      } catch (e) {}
    };
  }, [stream, name, socketId, userMutedAudio]);

  const handleEnableAudioClick = () => {
    const videoNode = videoRef.current;
    if (!videoNode) return;
    try {
      videoNode.muted = false;
      videoNode.play().catch(() => {});
      setAudioBlocked(false);
    } catch (e) {}
  };

  const toggleLocalMuteForTile = () => {
    const videoNode = videoRef.current;
    if (!videoNode) return;
    const next = !userMutedAudio;
    setUserMutedAudio(next);
    videoNode.muted = next;
  };

  return (
    <div className="bg-black rounded-lg relative overflow-hidden w-full h-full">
      {cameraActive ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-sm px-2 py-1 rounded-md flex items-center gap-2">
            <span className="font-medium">{name}</span>
          </div>

          <div className="absolute top-2 right-2 flex items-center gap-2">
            <button
              onClick={toggleLocalMuteForTile}
              className="px-2 py-1 rounded-md bg-black/50 text-xs text-gray-200 focus:outline-none"
              aria-pressed={userMutedAudio}
            >
              {userMutedAudio ? "Unmute" : "Mute"}
            </button>

            {audioBlocked && (
              <button
                onClick={handleEnableAudioClick}
                className="px-2 py-1 rounded-md bg-yellow-500/95 text-xs text-black font-medium focus:outline-none"
                aria-label={`Enable audio for ${name}`}
              >
                Enable audio
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <div className="text-center text-gray-200">
            <div
              className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-3 text-2xl font-bold"
              aria-hidden
            >
              {String(name || "P")
                .charAt(0)
                .toUpperCase()}
            </div>
            <div className="text-sm font-medium">{name}</div>
            <div className="text-xs text-gray-400 mt-1">Camera off</div>
          </div>

          <video ref={videoRef} autoPlay playsInline className="hidden" />
          <div className="absolute top-2 right-2">
            <button
              onClick={toggleLocalMuteForTile}
              className="px-2 py-1 rounded-md bg-black/50 text-xs text-gray-200 focus:outline-none"
            >
              {userMutedAudio ? "Unmute" : "Mute"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PeerTileStack({ socketId, stream, name }) {
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [userMutedAudio, setUserMutedAudio] = useState(false);

  useEffect(() => {
    const videoNode = videoRef.current;
    if (!videoNode || !stream) return;

    const videoTracks = stream.getVideoTracks() || [];
    const hasActiveVideo =
      videoTracks.length > 0 &&
      videoTracks.some((t) => t.readyState !== "ended" && t.enabled);
    setCameraActive(Boolean(hasActiveVideo));

    videoNode.srcObject = stream;

    let cancelled = false;
    const attemptPlay = async (tryMuted = false) => {
      if (cancelled) return;
      try {
        videoNode.muted = !!tryMuted || userMutedAudio;
        const p = videoNode.play();
        if (p !== undefined) {
          await p;
          if (!tryMuted) setAudioBlocked(false);
          else setAudioBlocked(true);
        }
      } catch (err) {
        if (!tryMuted) return attemptPlay(true);
        else setAudioBlocked(true);
      }
    };

    attemptPlay(false);

    const onTrackChange = () => {
      const vt = stream.getVideoTracks() || [];
      const hasVid = vt.some((t) => t.readyState !== "ended" && t.enabled);
      setCameraActive(Boolean(hasVid));
      attemptPlay(false);
    };

    stream.getTracks().forEach((track) => {
      track.onunmute = onTrackChange;
      track.onended = onTrackChange;
      track.onmute = onTrackChange;
    });

    return () => {
      cancelled = true;
      try {
        if (videoNode) {
          videoNode.pause();
          videoNode.srcObject = null;
        }
      } catch (e) {}
    };
  }, [stream, name, socketId, userMutedAudio]);

  const handleEnableAudioClick = () => {
    const videoNode = videoRef.current;
    if (!videoNode) return;
    try {
      videoNode.muted = false;
      videoNode.play().catch(() => {});
      setAudioBlocked(false);
    } catch (e) {}
  };

  const toggleLocalMuteForTile = () => {
    const videoNode = videoRef.current;
    if (!videoNode) return;
    const next = !userMutedAudio;
    setUserMutedAudio(next);
    videoNode.muted = next;
  };

  return (
    <div className="bg-black rounded-lg relative overflow-hidden w-full h-48 md:h-56 flex-shrink-0">
      {cameraActive ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-sm px-2 py-1 rounded-md flex items-center gap-2">
            <span className="font-medium">{name}</span>
          </div>

          <div className="absolute top-2 right-2 flex items-center gap-2">
            <button
              onClick={toggleLocalMuteForTile}
              className="px-2 py-1 rounded-md bg-black/50 text-xs text-gray-200 focus:outline-none"
              aria-pressed={userMutedAudio}
            >
              {userMutedAudio ? "Unmute" : "Mute"}
            </button>

            {audioBlocked && (
              <button
                onClick={handleEnableAudioClick}
                className="px-2 py-1 rounded-md bg-yellow-500/95 text-xs text-black font-medium focus:outline-none"
                aria-label={`Enable audio for ${name}`}
              >
                Enable audio
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <div className="text-center text-gray-200">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-2 text-xl font-bold">
              {String(name || "P")
                .charAt(0)
                .toUpperCase()}
            </div>
            <div className="text-sm font-medium">{name}</div>
            <div className="text-xs text-gray-400 mt-1">Camera off</div>
          </div>

          <video ref={videoRef} autoPlay playsInline className="hidden" />
          <div className="absolute top-2 right-2">
            <button
              onClick={toggleLocalMuteForTile}
              className="px-2 py-1 rounded-md bg-black/50 text-xs text-gray-200 focus:outline-none"
            >
              {userMutedAudio ? "Unmute" : "Mute"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
