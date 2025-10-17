import React from "react";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop } from "react-icons/fa";


export default function Controls({ muted, cameraOff, onToggleMute, onToggleCamera, onScreenShare }) {
  return (
    <div className="flex justify-center space-x-4 mt-2">
      {/* Mute/Unmute */}
      <button
        onClick={onToggleMute}
        className={`p-3 rounded-full ${muted ? "bg-red-600" : "bg-green-600"} hover:scale-110 transition`}
      >
        {muted ? <FaMicrophoneSlash size={20} /> : <FaMicrophone size={20} />}
      </button>

      {/* Camera On/Off */}
      <button
        onClick={onToggleCamera}
        className={`p-3 rounded-full ${cameraOff ? "bg-red-600" : "bg-green-600"} hover:scale-110 transition`}
      >
        {cameraOff ? <FaVideoSlash size={20} /> : <FaVideo size={20} />}
      </button>

      {/* Screen Share */}
      <button
        onClick={onScreenShare}
        className="p-3 rounded-full bg-blue-600 hover:scale-110 transition"
      >
        <FaDesktop size={20} />
      </button>
    </div>
  );
}
