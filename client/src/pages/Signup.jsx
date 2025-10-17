import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/"); // already logged in, go to Home
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Signup
      await axios.post("/api/users/signup", { name, email, password });

      // Auto-login after signup
      const res = await axios.post("/api/users/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect to Home
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded shadow-md w-80 text-white space-y-4">
        <h2 className="text-xl font-bold text-center">Sign Up</h2>
        {error && <div className="bg-red-500 p-2 rounded">{error}</div>}
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          className="w-full p-2 rounded bg-gray-700" 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          className="w-full p-2 rounded bg-gray-700" 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          className="w-full p-2 rounded bg-gray-700" 
          required 
        />
        <button type="submit" className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700">Sign Up</button>
        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <span className="text-blue-400 cursor-pointer" onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
}
