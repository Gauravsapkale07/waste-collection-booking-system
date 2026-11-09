import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
export default function Login({ onLogin }) {
  const [email, setEmail] = useState("admin@eco.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault(); setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      onLogin(data.data.user); navigate("/admin");
    } catch (err) { setError(err.response?.data?.message || "Login failed"); }
  }
  return <section className="narrow"><form className="panel form" onSubmit={submit}><span className="eyebrow">ADMIN ACCESS</span><h1>Login</h1>{error && <div className="notice error">{error}</div>}
    <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
    <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
    <button>Login</button><small>Demo: admin@eco.com / Admin@123</small>
  </form></section>;
}
