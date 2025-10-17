// src/routes/meetingsRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Meeting = require("../models/Meeting");

// Create a new meeting
router.post("/", async (req, res) => {
  const { meetingId, createdBy } = req.body;

  // Validate input
  if (!meetingId || !createdBy) {
    return res.status(400).json({ message: "Meeting ID and creator are required" });
  }

  if (!mongoose.Types.ObjectId.isValid(createdBy)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    // Check if meetingId already exists
    const existing = await Meeting.findOne({ meetingId });
    if (existing) {
      return res.status(400).json({ message: "Meeting ID already exists" });
    }

    const meeting = new Meeting({ meetingId, createdBy });
    await meeting.save();
    return res.status(201).json({ message: "Meeting created", meeting });
  } catch (err) {
    console.error("Error creating meeting:", err);
    return res.status(500).json({ message: "Server error creating meeting" });
  }
});

// Check if a meeting exists by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || id.length < 4) {
    return res.status(400).json({ message: "Invalid meeting ID" });
  }

  try {
    const meeting = await Meeting.findOne({ meetingId: id });
    if (!meeting) {
      return res.json({ exists: false });
    }
    return res.json({ exists: true, meeting });
  } catch (err) {
    console.error("Error checking meeting:", err);
    return res.status(500).json({ message: "Server error checking meeting" });
  }
});

module.exports = router;
