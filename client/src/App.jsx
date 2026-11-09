import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import ManageAreas from "./pages/ManageAreas";
import AdminMessages from "./pages/AdminMessages";
import Login from "./pages/Login";

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  function logout() {
    localStorage.removeItem("token"); localStorage.removeItem("user"); setUser(null);
  }
  return <>
    <Navbar user={user} onLogout={logout} />
    <main className="container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/areas" element={<ManageAreas />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="*" element={<div className="panel"><h2>Page not found</h2></div>} />
      </Routes>
    </main>
    <Footer />
  </>;
}
