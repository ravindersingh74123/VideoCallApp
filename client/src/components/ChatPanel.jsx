// src/components/ChatPanel.jsx
import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Send, X } from "lucide-react";

export default function ChatPanel({ messages, onSend, user, onClose }) {
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1E1E1E] p-4 text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Meeting Chat</h3>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg, idx) => (
          <MessageTile key={idx} message={msg} currentUser={user} />
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 rounded-lg bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          onClick={handleSend}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

function MessageTile({ message, currentUser }) {
  const timestamp = message.timestamp ? format(new Date(message.timestamp), "p") : "";
  const senderName = message.user?.name || "Unknown";
  
  // Robust check for current user's message
  const isMe = message.user?._id === (currentUser?._id || currentUser?.id);

  return (
    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[80%] p-3 rounded-xl ${
          isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-700 text-white rounded-bl-none"
        }`}
      >
        {!isMe && <div className="text-xs font-bold text-cyan-300 mb-1">{senderName}</div>}
        <p className="text-sm break-words">{message.message}</p>
      </div>
      <span className="text-xs text-gray-500 mt-1 px-1">{timestamp}</span>
    </div>
  );
}