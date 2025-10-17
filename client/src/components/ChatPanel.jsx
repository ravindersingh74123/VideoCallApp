// src/components/ChatPanel.jsx
import React, { useState, useRef, useEffect } from "react";

export default function ChatPanel({ messages = [], onSend }) {
  const [text, setText] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function submit() {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  }

  return (
    <div className="bg-gray-800 rounded-md p-3 flex flex-col h-96">
      <div className="flex-1 overflow-auto mb-2">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <div className="text-xs text-gray-400">{m.user?.name || "Anon"}</div>
            <div className="bg-gray-700 inline-block px-3 py-1 rounded">{m.message}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex space-x-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          className="flex-1 px-3 py-2 rounded bg-gray-900 text-white"
          placeholder="Type a message..."
        />
        <button onClick={submit} className="px-4 py-2 rounded bg-green-600 hover:bg-green-700">Send</button>
      </div>
    </div>
  );
}
