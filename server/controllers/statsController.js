import pool from "../config/db.js";

export async function getAdminStats(req, res) {
  try {
    const [[bookingCounts]] = await pool.query(`
      SELECT COUNT(*) AS totalBookings,
        SUM(status = 'Pending') AS pendingBookings,
        SUM(status = 'Assigned') AS assignedBookings,
        SUM(status = 'Completed') AS completedBookings,
        SUM(status = 'Cancelled') AS cancelledBookings
      FROM bookings
    `);
    const [[userCounts]] = await pool.query(`
      SELECT COUNT(*) AS totalUsers,
        SUM(role = 'collector') AS totalCollectors
      FROM users WHERE role IN ('user', 'collector')
    `);
    const [[areaCounts]] = await pool.query("SELECT COUNT(*) AS totalAreas FROM areas WHERE is_active = 1");
    const [[messageCounts]] = await pool.query("SELECT COUNT(*) AS totalMessages, SUM(is_read = 0) AS unreadMessages FROM messages");
    res.json({
      success: true,
      data: {
        ...bookingCounts,
        ...userCounts,
        ...areaCounts,
        ...messageCounts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not load dashboard statistics. Confirm that all shared tables exist." });
  }
}
