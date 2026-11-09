import React, { useEffect, useState } from "react";
import api from "../api";
import ConfirmBox from "../components/ConfirmBox";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [removeId, setRemoveId] = useState(null);
  const [notice, setNotice] = useState("");
  async function load() {
    try { const r = await api.get("/messages"); setMessages(r.data.data || []); }
    catch (e) { setNotice(e.response?.data?.message || "Could not load messages. Please login as admin."); }
  }
  useEffect(() => { load(); }, []);
  async function openMessage(id) {
    try { const r = await api.get(`/messages/${id}`); setSelected(r.data.data); load(); }
    catch (e) { setNotice(e.response?.data?.message || "Could not open message"); }
  }
  async function markRead(id) {
    try { await api.patch(`/messages/${id}/read`); setNotice("Message marked as read"); load(); }
    catch (e) { setNotice(e.response?.data?.message || "Could not update message"); }
  }
  async function remove() {
    try { await api.delete(`/messages/${removeId}`); setNotice("Message deleted"); setRemoveId(null); if (selected?.id === removeId) setSelected(null); load(); }
    catch (e) { setNotice(e.response?.data?.message || "Could not delete message"); setRemoveId(null); }
  }
  return <section><span className="eyebrow">ADMIN / INBOX</span><h1>Contact Messages</h1><p>Review enquiries submitted through the public contact form.</p>
    {notice && <div className="notice">{notice}</div>}
    <div className="two-col messages-layout"><div className="panel"><h2>Inbox ({messages.filter(m => !m.is_read).length} unread)</h2>
      {messages.map(m => <button key={m.id} className={`message-row ${selected?.id === m.id ? "selected" : ""}`} onClick={() => openMessage(m.id)}>
        <span><strong>{m.subject}</strong><small>{m.name} · {m.email}</small></span><span className={m.is_read ? "read-tag" : "unread-tag"}>{m.is_read ? "Read" : "New"}</span>
      </button>)}
      {!messages.length && <p>No messages yet.</p>}
    </div>
    <div className="panel"><h2>Message details</h2>{selected ? <>
      <h3>{selected.subject}</h3><p><b>From:</b> {selected.name} ({selected.email})</p><p className="message-body">{selected.message}</p>
      <div className="actions"><button className="secondary" onClick={() => markRead(selected.id)}>Mark read</button><button className="danger" onClick={() => setRemoveId(selected.id)}>Delete</button></div>
    </> : <p>Select a message to read it.</p>}</div></div>
    <ConfirmBox open={Boolean(removeId)} title="Delete message?" message="This message will be permanently deleted." onCancel={() => setRemoveId(null)} onConfirm={remove} />
  </section>;
}
