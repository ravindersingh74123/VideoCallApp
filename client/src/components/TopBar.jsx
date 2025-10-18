// src/components/TopBar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function TopBar() {
  const navigate = useNavigate();
  const user = (() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) {
        console.warn("⚠️ [HOME] No user found in localStorage.");
        return null; // Return null if nothing is found
      }
      const parsed = JSON.parse(raw);
      // Optional: Add basic validation if needed
      if (parsed && (parsed.id || parsed._id) && parsed.name) {
         // Ensure _id exists if id does
         if (parsed.id && !parsed._id) parsed._id = parsed.id;
         return parsed;
      } else {
         console.warn("⚠️ [HOME] Parsed user data is invalid.", parsed);
         localStorage.removeItem("user"); // Clear invalid data
         return null;
      }
    } catch (e) {
      console.error("❌ [HOME] Failed to parse localStorage user", e);
      localStorage.removeItem("user"); // Attempt to clear corrupted data
      return null; // Return null on error
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-transparent text-white px-6 py-4 flex justify-between items-center">
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
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
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold"
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
}
