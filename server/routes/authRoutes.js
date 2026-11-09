import { Router } from "express";
import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

// Temporary standalone login for local testing. Replace with Member 1's auth API when integrating.
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, password_hash, role, is_active FROM users WHERE email = ?",
      [email.toLowerCase().trim()]
    );
    const user = rows[0];
    if (!user || !user.is_active || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || "1d" });
    res.json({ success: true, data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } } });
  } catch {
    res.status(500).json({ success: false, message: "Login failed" });
  }
});
export default router;
