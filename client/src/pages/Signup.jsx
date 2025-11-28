import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("https://videocallapp-q3f0.onrender.com/api/users/signup", { name, email, password });

      const res = await axios.post("https://videocallapp-q3f0.onrender.com/api/users/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-96 text-white space-y-6 border border-gray-700"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-wide text-white">
            Create Account
          </h2>
          <p className="text-gray-400 text-sm">Join us and get started today</p>
        </div>

        {error && (
          <div className="bg-red-600/80 text-sm text-center p-2 rounded-md font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-2 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/20"
        >
          Sign Up
        </button>

        <p className="text-sm text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-400 font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
