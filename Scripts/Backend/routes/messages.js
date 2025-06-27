const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// POST a message
router.post('/send', async (req, res) => {
  try {
    const { userId, name, message } = req.body;
    const newMsg = new Message({ userId, name, message });
    await newMsg.save();
    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// GET all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
