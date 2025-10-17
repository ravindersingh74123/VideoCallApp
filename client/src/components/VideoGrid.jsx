// src/components/VideoGrid.jsx
import React from "react";

export default function VideoGrid({ localVideoRef, localStream, peers }) {
  // peers: { socketId: { stream: MediaStream } }
  const peerEntries = Object.entries(peers).filter(([id, p]) => p.stream && id !== undefined);

  return (
    <div className="bg-gray-800 rounded-lg p-2 h-[70vh] overflow-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Local */}
        <div className="bg-black rounded-md relative">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-56 object-cover rounded-md"
          />
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">You</div>
        </div>

        {/* Remote peers */}
        {peerEntries.map(([socketId, p]) => (
          <PeerTile key={socketId} socketId={socketId} stream={p.stream} />
        ))}
      </div>
    </div>
  );
}

function PeerTile({ socketId, stream }) {
  const ref = React.useRef();

  React.useEffect(() => {
    if (!ref.current) return;
    ref.current.srcObject = stream;
  }, [stream]);

  return (
    <div className="bg-black rounded-md relative">
      <video ref={ref} autoPlay playsInline className="w-full h-56 object-cover rounded-md" />
      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">{socketId.slice(0,6)}</div>
    </div>
  );
}
