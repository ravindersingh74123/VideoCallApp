const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  meetingId: { type: String, required: true, index: true },
  user: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, {
  // Disable the virtual 'id' field that Mongoose creates
  id: false,
  toJSON: { virtuals: false },
  toObject: { virtuals: false }
});

module.exports = mongoose.model("ChatMessage", chatMessageSchema);