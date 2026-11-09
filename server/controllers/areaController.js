import pool from "../config/db.js";

export async function getAreas(req, res) {
  try {
    const [rows] = await pool.query("SELECT id, name, pincode, is_active FROM areas ORDER BY name");
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not fetch areas" });
  }
}

export async function createArea(req, res) {
  const { name, pincode } = req.body;
  if (!name?.trim() || !/^\d{6}$/.test(String(pincode || ""))) {
    return res.status(400).json({ success: false, message: "Area name and valid 6-digit pincode are required" });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO areas (name, pincode) VALUES (?, ?)", [name.trim(), String(pincode)]
    );
    res.status(201).json({ success: true, message: "Area created", data: { id: result.insertId, name: name.trim(), pincode } });
  } catch (error) {
    res.status(error.code === "ER_DUP_ENTRY" ? 409 : 500).json({
      success: false, message: error.code === "ER_DUP_ENTRY" ? "Area name already exists" : "Could not create area"
    });
  }
}

export async function updateArea(req, res) {
  const { name, pincode, is_active } = req.body;
  if (!name?.trim() || !/^\d{6}$/.test(String(pincode || ""))) {
    return res.status(400).json({ success: false, message: "Area name and valid 6-digit pincode are required" });
  }
  try {
    const [result] = await pool.query(
      "UPDATE areas SET name = ?, pincode = ?, is_active = ? WHERE id = ?",
      [name.trim(), String(pincode), is_active === undefined ? 1 : Number(Boolean(is_active)), req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ success: false, message: "Area not found" });
    res.json({ success: true, message: "Area updated" });
  } catch (error) {
    res.status(error.code === "ER_DUP_ENTRY" ? 409 : 500).json({
      success: false, message: error.code === "ER_DUP_ENTRY" ? "Area name already exists" : "Could not update area"
    });
  }
}

export async function deleteArea(req, res) {
  try {
    const [result] = await pool.query("DELETE FROM areas WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: "Area not found" });
    res.json({ success: true, message: "Area deleted" });
  } catch (error) {
    const isFk = error.code === "ER_ROW_IS_REFERENCED_2";
    res.status(isFk ? 409 : 500).json({
      success: false,
      message: isFk ? "This area is used by bookings and cannot be deleted" : "Could not delete area"
    });
  }
}
