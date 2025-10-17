import React from "react";

export default function VideoGrid({ localVideoRef, peers, participants, user }) {
  // peers: { socketId: { peer: RTCPeerConnection, stream: MediaStream } }
  // participants: { socketId, user: { name, _id } }[]

  const peerEntries = Object.entries(peers).filter(
    ([, p]) => p.stream && p.stream.getTracks().length > 0
  );

  const totalParticipants = 1 + peerEntries.length;

  // Choose grid layout dynamically based on total participants
  const getGridClass = (count) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    if (count <= 4) return "grid-cols-2";
    if (count <= 9) return "grid-cols-3";
    return "grid-cols-4";
  };

  return (
    <div className="flex-1 overflow-auto bg-[#1E1E1E] rounded-xl p-4">
      <div
        className={`grid ${getGridClass(
          totalParticipants
        )} gap-4 place-items-center`}
      >
        {/* Local Video */}
        <div className="bg-black rounded-lg relative overflow-hidden w-full aspect-video">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-sm px-2 py-1 rounded-md">
            {user?.name || "You"} (You)
          </div>
        </div>

        {/* Remote Peers */}
        {peerEntries.map(([socketId, p]) => {
          // find the matching participant info
          const participant = participants.find(
            (pt) => pt.socketId === socketId
          );
          const name = participant?.user?.name || "Participant";

          return (
            <PeerTile key={socketId} stream={p.stream} name={name} />
          );
        })}
      </div>
    </div>
  );
}

function PeerTile({ stream, name }) {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="bg-black rounded-lg relative overflow-hidden w-full aspect-video">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-sm px-2 py-1 rounded-md">
        {name}
      </div>
    </div>
  );
}










