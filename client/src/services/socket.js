// src/services/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
});
