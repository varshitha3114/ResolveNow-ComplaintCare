// src/pages/Homepage.jsx

import React, { useEffect, useState } from 'react';
import {
  Typography, TextField, Grid, Button, Box
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

function Homepage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const isLoggedIn = localStorage.getItem("loggedIn");

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    description: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user || isLoggedIn !== "true") {
      alert("Please login first.");
      navigate("/login");
    }
  }, [user, isLoggedIn, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };

  const handleStatusClick = () => {
    navigate("/status");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { address, city, pincode, description } = formData;

    if (!address || !city || !pincode || !description) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("http://localhost:8000/api/complaints/register", {
        userId: user._id,
        ...formData,
        status: "Pending"
      });

      alert("✅ Complaint submitted successfully!");
      setFormData({
        address: "",
        city: "",
        state: "",
        pincode: "",
        description: ""
      });
      navigate("/status");
    } catch (error) {
      console.error("❌ Complaint submission failed:", error.response?.data || error.message);
      alert("Failed to submit complaint.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="homepage-wrapper">
      <div className="home-navbar">
        <Typography variant="h6">Hi, {user?.fullName}</Typography>
        <div className="nav-right">
          <span onClick={handleStatusClick}>Status</span>
          <Button variant="contained" color="error" onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      <div className="complaint-form">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Name" value={user?.fullName} disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="City" name="city" value={formData.city} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="State" name="state" value={formData.state} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
          </Grid>
          {/* ✏️ Description Box (larger, with Times New Roman) */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={5}
              label="Complaint Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              InputProps={{
                style: {
                  fontFamily: 'Times New Roman',
                  fontSize: '1.1rem',
                  backgroundColor: '#f1f8e9',
                  borderRadius: '12px',
                  padding: '12px'
                }
              }}
            />
          </Grid>
        </Grid>

        <Box textAlign="center" mt={3}>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Register"}
          </Button>
        </Box>
      </div>
    </div>
  );
}

export default Homepage;
