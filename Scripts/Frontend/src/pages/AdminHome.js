import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography, Select, MenuItem, Paper, Button, Box, TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './AdminHome.css';

function AdminHome() {
  const [complaints, setComplaints] = useState([]);
  const [activeBox, setActiveBox] = useState(null);
  const [messages, setMessages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const isLoggedIn = localStorage.getItem("loggedIn");

    if (!user || user.userType !== "admin" || isLoggedIn !== "true") {
      alert("Unauthorized access. Please login as admin.");
      navigate("/login");
    } else {
      fetchComplaints();
    }
  }, [navigate]);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/complaints");
      setComplaints(res.data);
    } catch (err) {
      console.error("❌ Failed to load complaints:", err.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8000/api/complaints/${id}/status`, { status });

      if (status.toLowerCase() === "resolved") {
        // Remove resolved complaint from list
        setComplaints(prev => prev.filter(c => c._id !== id));
      } else {
        setComplaints(prev =>
          prev.map(c => (c._id === id ? { ...c, status } : c))
        );
      }
    } catch (err) {
      console.error("❌ Failed to update status:", err.message);
    }
  };

  const sendMessage = async (id) => {
    if (!messages[id]) return;
    try {
      await axios.post(`http://localhost:8000/api/complaints/${id}/messages`, {
        sender: "admin",
        text: messages[id]
      });
      setMessages(prev => ({ ...prev, [id]: '' }));
      fetchComplaints();
    } catch (err) {
      console.error("❌ Failed to send message:", err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <Typography variant="h5">🛠️ Admin Dashboard</Typography>
        <Button className="logout-button" onClick={handleLogout}>Logout</Button>
      </div>

      <div className="admin-wrapper">
        {complaints.length === 0 && (
          <Typography variant="h6" color="textSecondary">
            No active complaints to display.
          </Typography>
        )}

        {complaints.map(c => (
          <Paper key={c._id} className="admin-complaint-card">
            <Typography><strong>ID:</strong> {c._id}</Typography>
            <Typography><strong>User:</strong> {c.userId?.fullName || "N/A"}</Typography>
            <Typography><strong>Description:</strong> {c.description}</Typography>

            <Typography className={`status-badge status-${c.status?.toLowerCase().replace(/\s/g, '')}`}>
              {c.status}
            </Typography>

            <Select
              value={c.status}
              onChange={(e) => updateStatus(c._id, e.target.value)}
              sx={{ mt: 1 }}
            >
              {["Pending", "In Progress", "Resolved", "Rejected"].map(status => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>

            <Box mt={2}>
              <Button onClick={() => setActiveBox(activeBox === c._id ? null : c._id)}>
                {activeBox === c._id ? "Hide Messages" : "View Messages"}
              </Button>

              {activeBox === c._id && (
                <Box className="chat-box">
                  {Array.isArray(c.messages) && c.messages.length > 0 ? (
                    c.messages.map((m, i) => (
                      <Box key={i} className={`chat-message ${m.sender}`}>
                        <Typography variant="body2"><strong>{m.sender}:</strong> {m.text}</Typography>
                        <Typography variant="caption">{new Date(m.timestamp).toLocaleString()}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2">No messages yet.</Typography>
                  )}

                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={messages[c._id] || ''}
                    onChange={e => setMessages(prev => ({ ...prev, [c._id]: e.target.value }))}
                    placeholder="Type your message to user..."
                  />
                  <Button variant="contained" onClick={() => sendMessage(c._id)} sx={{ mt: 1 }}>
                    Send
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        ))}
      </div>
    </div>
  );
}

export default AdminHome;
