// src/socket.js
const { v4: uuidv4 } = require('uuid');
const meetings = new Map(); // meetingId => { sockets: Map(socketId => { user }) }

function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('Socket connected', socket.id);

    socket.on('join-meeting', ({ meetingId, user }) => {
      socket.join(meetingId);
      let room = meetings.get(meetingId);
      if (!room) {
        room = { sockets: new Map() };
        meetings.set(meetingId, room);
      }
      room.sockets.set(socket.id, { user });

      // Notify existing participants about new user
      socket.to(meetingId).emit('user-joined', { socketId: socket.id, user });

      // Send list of existing participants to new user
      const participants = Array.from(room.sockets.entries()).map(([sid, info]) => ({ socketId: sid, user: info.user }));
      socket.emit('meeting-participants', participants);
    });

    socket.on('webrtc-offer', (payload) => {
      const { to } = payload;
      io.to(to).emit('webrtc-offer', { ...payload, from: socket.id });
    });

    socket.on('webrtc-answer', (payload) => {
      const { to } = payload;
      io.to(to).emit('webrtc-answer', { ...payload, from: socket.id });
    });

    socket.on('ice-candidate', ({ to, candidate }) => {
      io.to(to).emit('ice-candidate', { from: socket.id, candidate });
    });

    socket.on('chat-message', ({ meetingId, message, user }) => {
      io.to(meetingId).emit('chat-message', { message, user, timestamp: Date.now() });
    });

    socket.on('disconnecting', () => {
      // Remove from all rooms
      meetings.forEach((room, meetingId) => {
        if (room.sockets.has(socket.id)) {
          room.sockets.delete(socket.id);
          socket.to(meetingId).emit('user-left', { socketId: socket.id });
        }
      });
    });
  });
}

module.exports = { registerSocketHandlers };
