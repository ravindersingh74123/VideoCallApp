import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  PhoneOff,
  MessageSquare,
} from "lucide-react";

const ControlButton = ({ onClick, children, className = "", title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-3 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E1E1E] focus-visible:ring-blue-500 ${className}`}
  >
    {children}
  </button>
);

export default function Controls({
  muted,
  cameraOff,
  isChatOpen,
  onToggleMute,
  onToggleCamera,
  onScreenShare,
  onLeave,
  onToggleChat,
  isAdmin = false,
  participants = [],
}) {
  return (
    <div className="bg-[#1E1E1E] rounded-xl p-3 flex justify-center items-center gap-4 shadow-lg mx-auto">
      <ControlButton
        onClick={onToggleMute}
        title={muted ? "Unmute" : "Mute"}
        className={
          muted
            ? "bg-red-600 text-white"
            : "bg-gray-600 text-white hover:bg-gray-500"
        }
      >
        {muted ? <MicOff size={22} /> : <Mic size={22} />}
      </ControlButton>

      <ControlButton
        onClick={onToggleCamera}
        title={cameraOff ? "Turn Camera On" : "Turn Camera Off"}
        className={
          cameraOff
            ? "bg-red-600 text-white"
            : "bg-gray-600 text-white hover:bg-gray-500"
        }
      >
        {cameraOff ? <VideoOff size={22} /> : <Video size={22} />}
      </ControlButton>

      <ControlButton
        onClick={onScreenShare}
        title="Share Screen"
        className="bg-gray-600 text-white hover:bg-gray-500"
      >
        <ScreenShare size={22} />
      </ControlButton>

      <div className="h-8 w-[1px] bg-gray-600 mx-2"></div>

      <ControlButton
        onClick={onToggleChat}
        title={isChatOpen ? "Hide Chat" : "Show Chat"}
        className={
          isChatOpen
            ? "bg-blue-600 text-white"
            : "bg-gray-600 text-white hover:bg-gray-500"
        }
      >
        <MessageSquare size={22} />
      </ControlButton>

      <ControlButton
        onClick={onLeave}
        title="Leave Meeting"
        className="bg-red-600 text-white hover:bg-red-700"
      >
        <PhoneOff size={22} />
      </ControlButton>

      {isAdmin && (
        <div className="ml-4 text-gray-300 text-sm font-medium">
          Participants: {participants.length + 1}
        </div>
      )}
    </div>
  );
}
