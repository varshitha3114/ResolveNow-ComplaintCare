// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Box, Container, Grid } from '@mui/material';
import './Home.css';
import p from '../assets/main.png'; // ✅ Make sure this image exists

function Home() {
  return (
    <div className="home-wrapper">
      {/* ✅ Navbar */}
      <nav className="navbar">
        <div className="logo">ComplaintCare</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/signup">SignUp</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      {/* ✅ Hero Section */}
      <div className="home-page">
        <Container maxWidth="xl">
          <Grid container alignItems="center" spacing={4} className="hero-section">
            {/* Text Column */}
            <Grid item xs={12} md={5}>
              <Box className="text-section">
                <Typography variant="h5" className="logo-text">ResolveNow</Typography>
                <Typography variant="h2" className="main-heading">
                  Register, Track,<br /> and Resolve Your Complaints
                </Typography>
                
                {/* ✅ Fixed Button using Link */}
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Button variant="contained" className="home-button">
                    Register Complaint
                  </Button>
                </Link>
              </Box>
            </Grid>

            {/* Image Column */}
            <Grid item xs={12} md={7}>
              <Box className="image-container">
                <img src={p} alt="Complaint system" className="home-image" />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </div>

      {/* ✅ Footer */}
      <footer className="footer">
        <Typography className="footer-text">
          © 2025 ResolveNow | Designed by VarshithaRajakumar, intern @SmartBridge
        </Typography>
      </footer>
    </div>
  );
}

export default Home;
