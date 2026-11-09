import React from "react";
import { Link } from "react-router-dom";
export default function Navbar({ user, onLogout }) {
  return <header className="navbar">
    <Link className="brand" to="/">♻ EcoCollect</Link>
    <nav>
      <Link to="/">Home</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link>
      {user?.role === "admin" && <><Link to="/admin">Dashboard</Link><Link to="/admin/areas">Areas</Link><Link to="/admin/messages">Messages</Link></>}
      {!user ? <Link to="/login">Admin Login</Link> : <button className="link-button" onClick={onLogout}>Logout</button>}
    </nav>
  </header>;
}
