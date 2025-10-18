// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopBar from "../components/TopBar";
import { Video } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [meetingId, setMeetingId] = useState("");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || !localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate, user]);

  const handleCreateMeeting = async () => {
    if (!user || !(user.id || user._id)) {
      alert("User not logged in properly.");
      return;
    }
    setLoading(true);
    const newId = Math.random().toString(36).substring(2, 12);
    try {
      await axios.post("/api/meetings", {
        meetingId: newId,
        createdBy: user.id || user._id,
      });
      navigate(`/meeting/${newId}`);
    } catch (err) {
      console.error("Error creating meeting:", err);
      alert(err.response?.data?.message || "Failed to create meeting.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMeeting = async () => {
    if (!meetingId.trim()) {
      alert("Please enter a meeting ID");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`/api/meetings/${meetingId.trim()}`);
      if (res.data.exists) {
        navigate(`/meeting/${meetingId.trim()}`);
      } else {
        alert("Invalid Meeting ID");
      }
    } catch (err) {
      console.error("Error joining meeting:", err);
      alert(err.response?.data?.message || "Failed to join meeting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white overflow-hidden antialiased">
      <div className="flex-shrink-0">
        <TopBar />
      </div>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <div className="bg-[linear-gradient(180deg,#2a2d36cc,#1f2430cc)] border border-gray-800/40 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0 bg-blue-600/90 p-3 rounded-lg shadow">
                <Video size={32} />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
                  Welcome, {user?.name || "Guest"}!
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  Start or join a secure video meeting instantly.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <button
                onClick={handleCreateMeeting}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition shadow-lg text-sm font-semibold disabled:opacity-60"
              >
                {loading ? (
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="4"
                    />
                    <path
                      d="M22 12a10 10 0 00-10-10"
                      stroke="white"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : null}

                <span>{loading ? "Creating..." : "Create New Meeting"}</span>
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gray-700/50" />
              <div className="text-xs text-gray-400 uppercase tracking-wide">
                or join
              </div>
              <div className="h-px flex-1 bg-gray-700/50" />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Enter Meeting ID"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-[#31343d] placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />

              <button
                onClick={handleJoinMeeting}
                disabled={loading}
                className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition text-sm font-semibold shadow"
              >
                {loading ? "..." : "Join"}
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-400">
              Tip: Share the meeting ID with participants — anyone with the ID
              can join.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
