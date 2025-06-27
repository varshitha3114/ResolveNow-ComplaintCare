const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// POST message
router.post('/messages', async (req, res) => {
  const { userId, name, message } = req.body;
  try {
    const newMessage = new Message({ userId, name, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
