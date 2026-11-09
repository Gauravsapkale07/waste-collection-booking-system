import pool from "../config/db.js";

export async function createMessage(req, res) {
  const { name, email, subject, message } = req.body;
  if (!name?.trim() || !subject?.trim() || !/^\S+@\S+\.\S+$/.test(email || "") ||
      !message?.trim() || message.trim().length < 10 || message.trim().length > 500) {
    return res.status(400).json({ success: false, message: "Enter a name, valid email, subject and message (10–500 characters)" });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [name.trim(), email.trim().toLowerCase(), subject.trim(), message.trim()]
    );
    res.status(201).json({ success: true, message: "Your message has been sent", data: { id: result.insertId } });
  } catch {
    res.status(500).json({ success: false, message: "Could not save message" });
  }
}

export async function getMessages(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, subject, message, is_read, created_at FROM messages ORDER BY created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: "Could not fetch messages" });
  }
}

export async function getMessage(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM messages WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Message not found" });
    await pool.query("UPDATE messages SET is_read = 1 WHERE id = ?", [req.params.id]);
    res.json({ success: true, data: { ...rows[0], is_read: 1 } });
  } catch {
    res.status(500).json({ success: false, message: "Could not fetch message" });
  }
}

export async function markMessageRead(req, res) {
  try {
    const [result] = await pool.query("UPDATE messages SET is_read = 1 WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: "Message not found" });
    res.json({ success: true, message: "Message marked as read" });
  } catch {
    res.status(500).json({ success: false, message: "Could not update message" });
  }
}

export async function deleteMessage(req, res) {
  try {
    const [result] = await pool.query("DELETE FROM messages WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: "Message not found" });
    res.json({ success: true, message: "Message deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Could not delete message" });
  }
}
