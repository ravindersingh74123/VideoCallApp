// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopBar from "../components/TopBar";

export default function Home() {
  const navigate = useNavigate();
  const [meetingId, setMeetingId] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user || !localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate, user]);

 const handleCreateMeeting = async () => {
  if (!user || !user.id) {
    alert("User not logged in properly.");
    return;
  }

  const newId = Math.random().toString(36).substring(2, 10);
  setLoading(true);

  try {
    await axios.post("/api/meetings", {
      meetingId: newId,
      createdBy: user.id,
    });
    navigate(`/meeting/${newId}`);
  } catch (err) {
    console.error("Error creating meeting:", err);
    alert(err.response?.data?.message || "Failed to create meeting. Try again.");
  } finally {
    setLoading(false);
  }
};


  const handleJoinMeeting = async () => {
    if (!meetingId.trim()) return alert("Please enter a meeting ID");
    setLoading(true);

    try {
      const res = await axios.get(`/api/meetings/${meetingId.trim()}`);
      if (!res.data.exists) {
        alert("Invalid Meeting ID");
        return;
      }
      navigate(`/meeting/${meetingId.trim()}`);
    } catch (err) {
      console.error("Error checking meeting:", err);
      alert(err.response?.data?.message || "Failed to join meeting. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <TopBar />
      <div className="flex items-center justify-center h-[calc(100vh-64px)] text-white">
        <div className="bg-gray-800 p-8 rounded shadow-md w-96 space-y-6 text-center">
          <h1 className="text-2xl font-bold">
            Welcome, {user?.name || "Guest"}
          </h1>

          <button
            onClick={handleCreateMeeting}
            className="w-full p-3 bg-blue-600 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create New Meeting"}
          </button>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter Meeting ID"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              className="flex-1 p-2 rounded bg-gray-700 text-white"
            />
            <button
              onClick={handleJoinMeeting}
              className="p-2 bg-green-600 rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Joining..." : "Join"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
