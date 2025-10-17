// src/components/TopBar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div className="text-lg font-bold cursor-pointer" onClick={() => navigate("/")}>
        VideoMeet
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span>Hello, {user.name}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded"
            >
              Signup
            </button>
          </>
        )}
      </div>
    </div>
  );
}
