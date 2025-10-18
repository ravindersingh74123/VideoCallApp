const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
  permissions: {
    canUnmute: { type: Boolean, default: true },
    canVideo: { type: Boolean, default: true },
    canScreenShare: { type: Boolean, default: false },
  },
  status: { 
    type: String, 
    enum: ['waiting', 'admitted', 'denied'], 
    default: 'admitted' 
  }
}, { _id: false });

const meetingSchema = new mongoose.Schema({
  meetingId: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  
  // Admin settings - CHANGED: requireAdmission is now true by default
  settings: {
    requireAdmission: { type: Boolean, default: true }, // ← CHANGED TO TRUE
    muteMicOnEntry: { type: Boolean, default: false },
    disableVideoOnEntry: { type: Boolean, default: false },
    allowScreenShare: { type: Boolean, default: true },
  },
  
  // Track participants
  participants: [participantSchema],
});

// Helper method to check if user is admin
meetingSchema.methods.isAdmin = function(userId) {
  return this.createdBy.toString() === userId.toString();
};

// Helper method to get participant permissions
meetingSchema.methods.getParticipantPermissions = function(userId) {
  const participant = this.participants.find(
    p => p.userId.toString() === userId.toString()
  );
  return participant ? participant.permissions : null;
};

module.exports = mongoose.model("Meeting", meetingSchema);