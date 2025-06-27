import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Homepage from './pages/Homepage';
import Status from './pages/Status';
import AdminHome from './pages/AdminHome';
import AdminChat from './pages/AdminChat'; // ✅ Import AdminChat Page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/status" element={<Status />} />
        <Route path="/adminhome" element={<AdminHome />} />
        <Route path="/adminchat" element={<AdminChat />} /> {/* ✅ Add route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
