// routes/notifications.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// ➕ Send a notification
router.post('/send', async (req, res) => {
  try {
    const { userId, message } = req.body;
    const newNote = new Notification({ userId, message });
    await newNote.save();
    res.status(200).json({ success: true, note: newNote });
  } catch (err) {
    res.status(500).json({ error: "Failed to send notification" });
  }
});

// 📥 Get notifications for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const notes = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

module.exports = router;
