import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";

export default function ChatPanel({ messages, onSend }) {
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-[60vh] flex flex-col">
      <h3 className="text-white font-semibold mb-2">Chat</h3>
      <div className="flex-1 overflow-auto space-y-2 mb-2">
        {messages.map((msg, idx) => (
          <MessageTile key={idx} message={msg} />
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}

function MessageTile({ message }) {
  const timestamp = message.timestamp ? format(new Date(message.timestamp), "HH:mm") : "";
  const sender = message.user?.name || "Unknown";

  const isMe = sender === "Me";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] p-2 rounded-md ${
          isMe ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
        }`}
      >
        {!isMe && <div className="text-xs font-semibold mb-1">{sender}</div>}
        <div>{message.message}</div>
        <div className="text-xs text-gray-300 text-right mt-1">{timestamp}</div>
      </div>
    </div>
  );
}
