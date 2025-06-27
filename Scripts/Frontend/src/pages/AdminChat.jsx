import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Button, TextField } from '@mui/material';

export default function AdminChat() {
  const [complaints, setComplaints] = useState([]);
  const [active, setActive] = useState(null);
  const [adminTxt, setAdminTxt] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8000/api/complaints')
      .then(res => setComplaints(res.data))
      .catch(console.error);
  }, []);

  const handleSend = async (id) => {
    await axios.post(`http://localhost:8000/api/complaints/${id}/messages`, {
      sender: "admin", text: adminTxt[id]
    });
    setAdminTxt(prev => ({ ...prev, [id]: "" }));
    const res = await axios.get('http://localhost:8000/api/complaints');
    setComplaints(res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:8000/api/complaints/${id}/status`, { status });
    const res = await axios.get('http://localhost:8000/api/complaints');
    setComplaints(res.data);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Admin Chat Panel</Typography>
      {complaints.map(c => (
        <Paper key={c._id} sx={{ mt: 2, p: 2 }}>
          <Typography><b>User:</b> {c.userId.fullName} ({c.userId.email})</Typography>
          <Typography><b>Status:</b> {c.status}</Typography>
          <Button onClick={() => updateStatus(c._id, 'resolved')}>Set Resolved</Button>
          <Button onClick={() => updateStatus(c._id, 'rejected')}>Set Rejected</Button>

          <Box sx={{ mt: 2 }}>
            {c.messages.map((m, i) => (
              <Box key={i} sx={{ mb: 1 }}>
                <Typography><strong>{m.sender}:</strong> {m.text}</Typography>
                <Typography variant="caption">{new Date(m.timestamp).toLocaleString()}</Typography>
              </Box>
            ))}
          </Box>

          <TextField
            fullWidth multiline rows={2}
            value={adminTxt[c._id] || ''}
            onChange={e => setAdminTxt(prev => ({ ...prev, [c._id]: e.target.value }))}
            placeholder="Admin reply…"
          />
          <Button onClick={() => handleSend(c._id)} variant="contained">
            Send Reply
          </Button>
        </Paper>
      ))}
    </Box>
  );
}
