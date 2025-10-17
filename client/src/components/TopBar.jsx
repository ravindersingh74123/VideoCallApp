// src/components/TopBar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react"; // Icon for logout

export default function TopBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-transparent text-white px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>
        VideoMeet
      </div>
      
      {user ? (
        <div className="flex items-center space-x-4">
          <span className="text-gray-300">Hello, {user.name}</span>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <button onClick={() => navigate("/login")} className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Login
          </button>
          <button onClick={() => navigate("/signup")} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold">
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
}