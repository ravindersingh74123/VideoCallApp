// src/components/Controls.jsx
import React from "react";

export default function Controls({ muted, cameraOff, onToggleMute, onToggleCamera, onScreenShare }) {
  return (
    <div className="bg-gray-800 rounded-md p-3">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm">Microphone</div>
          <button onClick={onToggleMute} className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">
            {muted ? "Unmute" : "Mute"}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">Camera</div>
          <button onClick={onToggleCamera} className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">
            {cameraOff ? "Turn On" : "Turn Off"}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">Screen Share</div>
          <button onClick={onScreenShare} className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700">
            Share Screen
          </button>
        </div>
      </div>
    </div>
  );
}
