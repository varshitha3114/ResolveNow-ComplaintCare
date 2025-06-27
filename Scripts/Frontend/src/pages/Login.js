// ✅ Frontend - Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import './Login.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (isLoggedIn === "true" && currentUser) {
      if (currentUser.userType === "admin") navigate("/adminhome");
      else navigate("/homepage");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      });

      const user = res.data.user;
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("loggedIn", "true");

      alert("✅ Login successful!");

      if (user.userType === "admin") {
        navigate("/adminhome");
      } else {
        navigate("/homepage");
      }
    } catch (error) {
      console.error("❌ Login failed:", error?.response?.data || error.message);
      alert("Invalid credentials. Please check your email and password.");
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">ComplaintCare</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/signup">SignUp</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      <div className="login-container">
        <div className="login-box">
          <Typography variant="h4" className="login-title" gutterBottom>
            Login For Registering the Complaint
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" className="login-button" fullWidth>
              Login
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
