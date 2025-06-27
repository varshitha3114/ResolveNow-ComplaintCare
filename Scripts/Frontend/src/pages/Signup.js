// src/pages/Signup.jsx
import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Select, MenuItem,
  FormControl, InputLabel, Container, Typography
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    mobile: '',
    userType: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn === "true") {
      navigate("/home");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/auth/signup", formData);

      localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      localStorage.setItem("loggedIn", "true");

      alert("✅ Registration successful!");

      // Redirect to home after signup
      navigate("/home");
    } catch (err) {
      alert("❌ Registration failed");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="signup-page">
      <nav className="navbar">
        <div className="logo">ComplaintCare</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/signup">SignUp</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      <div className="signup-background">
        <Container maxWidth="sm" className="signup-container">
          <Typography variant="h4" className="signup-title" gutterBottom>
            Sign Up to Register Your Complaint
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Full Name"
              name="fullName"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />
            <TextField
              label="Mobile No"
              name="mobile"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>User Type</InputLabel>
              <Select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              className="signup-button"
              fullWidth
            >
              Register
            </Button>

            <Typography
              variant="body1"
              align="center"
              style={{ marginTop: '20px' }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: '#0288d1',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                Login
              </Link>
            </Typography>
          </form>
        </Container>
      </div>
    </div>
  );
}

export default Signup;
