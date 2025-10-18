import React, { useState } from "react";
import {
  Users,
  Settings,
  Shield,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  UserX,
  CheckCircle,
  XCircle,
  Crown,
  MoreVertical,
} from "lucide-react";

export default function AdminPanel({
  participants = [],
  waitingRoom = [],
  isAdmin,
  onAdmitUser,
  onDenyUser,
  onUpdatePermissions,
  onRemoveParticipant,
  onUpdateSettings,
  currentSettings = {},
}) {
  const [activeTab, setActiveTab] = useState("participants");
  const [showSettings, setShowSettings] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const [settings, setSettings] = useState({
    requireAdmission: currentSettings.requireAdmission || false,
    muteMicOnEntry: currentSettings.muteMicOnEntry || false,
    disableVideoOnEntry: currentSettings.disableVideoOnEntry || false,
    allowScreenShare: currentSettings.allowScreenShare || true,
  });

  React.useEffect(() => {
    if (waitingRoom.length > 0 && activeTab === "participants") {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("New participant waiting", {
          body: `${
            waitingRoom[waitingRoom.length - 1].name
          } is waiting to join`,
          icon: "/vite.svg",
        });
      }
    }
  }, [waitingRoom.length]);

  if (!isAdmin) {
    return null;
  }

  const handleSettingsUpdate = () => {
    onUpdateSettings(settings);
    setShowSettings(false);
  };

  const togglePermission = (userId, permission) => {
    const participant = participants.find(
      (p) => p.user._id === userId || p.user.id === userId
    );
    if (participant) {
      onUpdatePermissions(userId, {
        ...participant.permissions,
        [permission]: !participant.permissions[permission],
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1E1E1E] text-white">
      <div className="flex-shrink-0 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="text-yellow-500" size={24} />
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Meeting Settings"
          >
            <Settings size={20} />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("participants")}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "participants"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users size={18} />
              <span>Participants ({participants.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("waiting")}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "waiting"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Shield size={18} />
              <span>Waiting ({waitingRoom.length})</span>
            </div>
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="flex-shrink-0 p-4 bg-gray-800 border-b border-gray-700">
          <h3 className="font-semibold mb-3 text-lg">Meeting Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Require Admission</span>
              <input
                type="checkbox"
                checked={settings.requireAdmission}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    requireAdmission: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Mute Mic on Entry</span>
              <input
                type="checkbox"
                checked={settings.muteMicOnEntry}
                onChange={(e) =>
                  setSettings({ ...settings, muteMicOnEntry: e.target.checked })
                }
                className="w-5 h-5 rounded"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Disable Video on Entry</span>
              <input
                type="checkbox"
                checked={settings.disableVideoOnEntry}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    disableVideoOnEntry: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Allow Screen Share</span>
              <input
                type="checkbox"
                checked={settings.allowScreenShare}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    allowScreenShare: e.target.checked,
                  })
                }
                className="w-5 h-5 rounded"
              />
            </label>
          </div>
          <button
            onClick={handleSettingsUpdate}
            className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Save Settings
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "participants" && (
          <div className="space-y-2">
            {participants.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No participants yet
              </div>
            ) : (
              participants.map((participant) => (
                <ParticipantCard
                  key={participant.socketId}
                  participant={participant}
                  isOpen={openMenu === participant.socketId}
                  onToggleMenu={() =>
                    setOpenMenu(
                      openMenu === participant.socketId
                        ? null
                        : participant.socketId
                    )
                  }
                  onTogglePermission={togglePermission}
                  onRemove={() => {
                    onRemoveParticipant(
                      participant.user._id || participant.user.id
                    );
                    setOpenMenu(null);
                  }}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "waiting" && (
          <div className="space-y-2">
            {waitingRoom.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No one waiting
              </div>
            ) : (
              waitingRoom.map((user) => (
                <WaitingUserCard
                  key={user.socketId}
                  user={user}
                  onAdmit={() => onAdmitUser(user.userId, user.socketId)}
                  onDeny={() => onDenyUser(user.userId, user.socketId)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ParticipantCard({
  participant,
  isOpen,
  onToggleMenu,
  onTogglePermission,
  onRemove,
}) {
  const userId = participant.user._id || participant.user.id;
  const permissions = participant.permissions || {};

  return (
    <div className="bg-gray-800 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-semibold">
            {participant.user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{participant.user.name}</span>
              {participant.isAdmin && (
                <Crown size={16} className="text-yellow-500" />
              )}
            </div>
            <div className="flex gap-2 mt-1">
              {permissions.canUnmute ? (
                <Mic size={14} className="text-green-500" />
              ) : (
                <MicOff size={14} className="text-red-500" />
              )}
              {permissions.canVideo ? (
                <Video size={14} className="text-green-500" />
              ) : (
                <VideoOff size={14} className="text-red-500" />
              )}
              {permissions.canScreenShare && (
                <Monitor size={14} className="text-green-500" />
              )}
            </div>
          </div>
        </div>

        {!participant.isAdmin && (
          <div className="relative">
            <button
              onClick={onToggleMenu}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MoreVertical size={20} />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-lg shadow-xl border border-gray-700 z-50">
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => onTogglePermission(userId, "canUnmute")}
                    className="w-full px-3 py-2 text-left hover:bg-gray-700 rounded flex items-center gap-2"
                  >
                    {permissions.canUnmute ? (
                      <MicOff size={16} />
                    ) : (
                      <Mic size={16} />
                    )}
                    <span className="text-sm">
                      {permissions.canUnmute ? "Disable Mic" : "Enable Mic"}
                    </span>
                  </button>
                  <button
                    onClick={() => onTogglePermission(userId, "canVideo")}
                    className="w-full px-3 py-2 text-left hover:bg-gray-700 rounded flex items-center gap-2"
                  >
                    {permissions.canVideo ? (
                      <VideoOff size={16} />
                    ) : (
                      <Video size={16} />
                    )}
                    <span className="text-sm">
                      {permissions.canVideo ? "Disable Video" : "Enable Video"}
                    </span>
                  </button>
                  <button
                    onClick={() => onTogglePermission(userId, "canScreenShare")}
                    className="w-full px-3 py-2 text-left hover:bg-gray-700 rounded flex items-center gap-2"
                  >
                    <Monitor size={16} />
                    <span className="text-sm">
                      {permissions.canScreenShare
                        ? "Disable Screen Share"
                        : "Enable Screen Share"}
                    </span>
                  </button>
                  <div className="border-t border-gray-700 my-1"></div>
                  <button
                    onClick={onRemove}
                    className="w-full px-3 py-2 text-left hover:bg-red-600 rounded flex items-center gap-2 text-red-400 hover:text-white"
                  >
                    <UserX size={16} />
                    <span className="text-sm">Remove from Meeting</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function WaitingUserCard({ user, onAdmit, onDeny }) {
  return (
    <div className="bg-gray-800 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-600 flex items-center justify-center font-semibold">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="font-medium">{user.name}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAdmit}
            className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            title="Admit"
          >
            <CheckCircle size={20} />
          </button>
          <button
            onClick={onDeny}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            title="Deny"
          >
            <XCircle size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
