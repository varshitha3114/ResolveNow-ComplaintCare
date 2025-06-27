const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// Register Complaint
router.post('/register', async (req, res) => {
  try {
    const { userId, name, address, city, state, pincode, description } = req.body;

    // Validate required fields before creating a complaint
    if (!userId || !name || !address || !city || !state || !pincode || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const complaint = new Complaint({
      userId, 
      name, 
      address, 
      city, 
      state, 
      pincode, 
      description
    });

    await complaint.save(); // Save the complaint to MongoDB

    res.status(201).json({
      message: "Complaint submitted successfully!",
      complaint
    });
  } catch (err) {
    console.error("Error during complaint submission:", err);
    res.status(500).json({ message: "Failed to register complaint", error: err.message });
  }
});

// Get Complaints by User
router.get('/user/:userId', async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.params.userId });

    if (complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found for this user" });
    }

    res.json(complaints);
  } catch (err) {
    console.error("Error fetching complaints:", err);
    res.status(500).json({ message: "Failed to retrieve complaints", error: err.message });
  }
});

// Get All Complaints (for Admin)
router.get('/all', async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('userId', 'fullName email');

    if (complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found" });
    }

    res.json(complaints);
  } catch (err) {
    console.error("Error fetching all complaints:", err);
    res.status(500).json({ message: "Failed to retrieve all complaints", error: err.message });
  }
});

module.exports = router;
