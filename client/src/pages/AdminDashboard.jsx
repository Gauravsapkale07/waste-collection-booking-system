import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { api.get("/admin/stats").then(r => setStats(r.data.data)).catch(e => setError(e.response?.data?.message || "Please login as admin and confirm all database tables exist.")); }, []);
  const cards = stats ? [
    ["Total bookings", stats.totalBookings], ["Pending", stats.pendingBookings || 0],
    ["Assigned", stats.assignedBookings || 0], ["Completed", stats.completedBookings || 0],
    ["Total users", stats.totalUsers || 0], ["Collectors", stats.totalCollectors || 0],
    ["Active areas", stats.totalAreas || 0], ["Unread messages", stats.unreadMessages || 0]
  ] : [];
  const chartData = stats ? [
    { status: "Pending", count: Number(stats.pendingBookings || 0) },
    { status: "Assigned", count: Number(stats.assignedBookings || 0) },
    { status: "Completed", count: Number(stats.completedBookings || 0) },
    { status: "Cancelled", count: Number(stats.cancelledBookings || 0) }
  ] : [];
  return <section><span className="eyebrow">OVERVIEW</span><h1>Admin Dashboard</h1><p>At-a-glance view of collection operations.</p>
    {error && <div className="notice">{error}</div>}
    {!stats && !error && <p>Loading dashboard...</p>}
    {stats && <>
      <div className="stat-grid">{cards.map(([label, value]) => <article className="stat-card" key={label}><span>{label}</span><strong>{value ?? 0}</strong></article>)}</div>
      <div className="panel chart-panel"><h2>Booking status overview</h2><div className="chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><XAxis dataKey="status" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#198754" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer></div></div>
    </>}
  </section>;
}
