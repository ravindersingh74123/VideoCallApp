// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopBar from "../components/TopBar";
import { Video } from "lucide-react"; // Using lucide-react for a clean icon

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
    <div className="bg-[#1c1f2e] min-h-screen text-white">
      <TopBar />
      <div className="flex items-center justify-center h-[calc(100vh-64px)] px-4">
        <div className="bg-[#2b2d3a] p-8 rounded-xl shadow-2xl w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-4 rounded-full">
              <Video size={40} />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {user?.name || "Guest"}!
          </h1>
          <p className="text-gray-400">
            Start or join a video meeting instantly.
          </p>

          <button
            onClick={handleCreateMeeting}
            className="w-full p-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-500"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create New Meeting"}
          </button>

          <div className="flex items-center gap-2">
             <div className="w-full h-[1px] bg-gray-600"></div>
             <span className="text-gray-400 text-sm">OR</span>
             <div className="w-full h-[1px] bg-gray-600"></div>
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter Meeting ID"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-[#3d3f4e] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
            <button
              onClick={handleJoinMeeting}
              className="p-3 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 disabled:bg-gray-500"
              disabled={loading}
            >
              {loading ? "..." : "Join"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}