import React, { useState } from "react";
import api from "../api";
export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  async function submit(e) {
    e.preventDefault(); setNotice(""); setBusy(true);
    try { const r = await api.post("/messages", form); setNotice(r.data.message); setForm({ name: "", email: "", subject: "", message: "" }); }
    catch (err) { setNotice(err.response?.data?.message || "Unable to send message. Is the backend running?"); }
    finally { setBusy(false); }
  }
  return <section className="form-layout"><div><span className="eyebrow">GET IN TOUCH</span><h1>Contact us</h1><p>Have a question about waste collection? Send our team a message.</p></div>
    <form className="panel form" onSubmit={submit}>
      {notice && <div className="notice">{notice}</div>}
      <label>Your name<input name="name" value={form.name} onChange={change} required maxLength="50" /></label>
      <label>Email address<input type="email" name="email" value={form.email} onChange={change} required /></label>
      <label>Subject<input name="subject" value={form.subject} onChange={change} required maxLength="100" /></label>
      <label>Message<textarea name="message" value={form.message} onChange={change} required minLength="10" maxLength="500" rows="5" /></label>
      <button disabled={busy}>{busy ? "Sending..." : "Send message"}</button>
    </form>
  </section>;
}
