// src/pages/Status.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Paper, Button, TextField, Rating
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Status.css';

function Status() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeBox, setActiveBox] = useState(null);
  const [ratings, setRatings] = useState({});
  const [submittedRatings, setSubmittedRatings] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (!storedUser || isLoggedIn !== "true") {
      alert("Please login first.");
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  useEffect(() => {
    if (user) fetchComplaints();
  }, [user]);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/complaints/user/${user._id}`);
      setComplaints(res.data);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved': return 'status-resolved';
      case 'in progress': return 'status-inprogress';
      default: return 'status-pending';
    }
  };

  const toggleMessageBox = (id) => {
    setActiveBox(activeBox === id ? null : id);
  };

  const handleSendMessage = async (id) => {
    if (!messages[id]) return;
    try {
      await axios.post(`http://localhost:8000/api/complaints/${id}/messages`, {
        sender: user.userType,
        text: messages[id]
      });
      setMessages(prev => ({ ...prev, [id]: '' }));
      fetchComplaints();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleRatingChange = (id, value) => {
    setRatings(prev => ({ ...prev, [id]: value }));
  };

  const submitRating = async (id) => {
    const rating = ratings[id];
    if (!rating) return;
    try {
      await axios.put(`http://localhost:8000/api/complaints/${id}/rate`, { rating });
      setSubmittedRatings(prev => ({ ...prev, [id]: true }));
      alert("✅ Thank you for your rating!");
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  if (!user) return null;

  return (
    <div className="status-page">
      <div className="status-navbar">
        <Typography variant="h6">Hi, {user.fullName}</Typography>
        <Button variant="contained" color="error" onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}>Logout</Button>
      </div>

      <Box className="status-wrapper">
        {complaints.length === 0 && <Typography>No complaints submitted yet.</Typography>}

        {complaints.map(c => (
          <Paper key={c._id} className="complaint-card">
            <Typography><strong>Description:</strong> {c.description}</Typography>
            <Typography><strong>Address:</strong> {c.address}</Typography>
            <Typography><strong>City:</strong> {c.city}</Typography>
            <Typography><strong>State:</strong> {c.state}</Typography>
            <Typography><strong>Pincode:</strong> {c.pincode}</Typography>
            <Typography><strong>Status:</strong>&nbsp;
              <span className={`status-badge ${getStatusClass(c.status)}`}>{c.status}</span>
            </Typography>

            {/* ⭐ Rating Box */}
            {c.status.toLowerCase() === 'resolved' && !submittedRatings[c._id] && (
              <Box className="rating-box">
                <Typography className="rating-label">⭐ Rate the service:</Typography>
                <Rating
                  value={ratings[c._id] || null}
                  onChange={(e, v) => handleRatingChange(c._id, v)}
                  size="large"
                />
                <Button
                  variant="contained"
                  color="primary"
                  className="rating-submit"
                  onClick={() => submitRating(c._id)}
                  disabled={!ratings[c._id]}
                >
                  Submit Rating
                </Button>
              </Box>
            )}

            <Button className="message-btn" onClick={() => toggleMessageBox(c._id)}>
              {activeBox === c._id ? "Hide Messages" : "Messages"}
            </Button>

            {activeBox === c._id && (
              <Box className="chat-box">
                {c.messages?.map((m, i) => (
                  <Box key={i} className={`chat-msg ${m.sender}`}>
                    <Typography variant="body2"><strong>{m.sender}:</strong> {m.text}</Typography>
                    <Typography variant="caption">{new Date(m.timestamp).toLocaleString()}</Typography>
                  </Box>
                ))}
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={messages[c._id] || ''}
                  onChange={e => setMessages(prev => ({ ...prev, [c._id]: e.target.value }))}
                  placeholder={`Reply as ${user.userType}`}
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mt: 1 }}
                  onClick={() => handleSendMessage(c._id)}
                >
                  Send
                </Button>
              </Box>
            )}
          </Paper>
        ))}
      </Box>
    </div>
  );
}

export default Status;
