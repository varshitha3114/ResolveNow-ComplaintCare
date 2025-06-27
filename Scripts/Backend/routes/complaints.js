// routes/complaints.js

const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// Get all complaints (admin only)
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("userId");
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
});

// Get user complaints
router.get("/user/:userId", async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.params.userId });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user complaints" });
  }
});

// Register a new complaint
router.post("/register", async (req, res) => {
  try {
    const complaint = new Complaint(req.body);
    await complaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ error: "Failed to register complaint" });
  }
});

// Update complaint status
router.put("/:id/status", async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    complaint.status = req.body.status;
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// Add message to complaint
router.post("/:id/messages", async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    const message = {
      sender: req.body.sender,
      text: req.body.text,
      timestamp: new Date(),
    };

    complaint.messages.push(message);
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Submit rating
router.put("/:id/rate", async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    complaint.rating = req.body.rating;
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: "Failed to submit rating" });
  }
});

// 🗑️ Delete complaint (used when resolved)
router.delete("/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    res.json({ message: "Complaint deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete complaint" });
  }
});

module.exports = router;
