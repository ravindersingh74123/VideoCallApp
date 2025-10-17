import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [meetingId, setMeetingId] = useState("");
  const navigate = useNavigate();

  const createMeeting = () => {
    const id = uuidv4();
    navigate(`/meeting/${id}`);
  };

  const joinMeeting = () => {
    if (meetingId.trim()) navigate(`/meeting/${meetingId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Video Call App</h1>

      <div className="flex space-x-4">
        <button onClick={createMeeting} className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
          Create Meeting
        </button>

        <input
          type="text"
          placeholder="Enter Meeting ID"
          value={meetingId}
          onChange={(e) => setMeetingId(e.target.value)}
          className="px-3 py-2 rounded-lg text-black"
        />
        <button onClick={joinMeeting} className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700">
          Join
        </button>
      </div>
    </div>
  );
}
