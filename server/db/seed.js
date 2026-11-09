import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";

dotenv.config();

async function seed() {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Demo users: 1 Admin, 2 Collectors, 3 Regular users
    const users = [
      ["Admin User", "admin@eco.com", "Admin@123", "9999999999", "Admin Office", "admin"],
      ["Rahul Collector", "rahul@eco.com", "Collector@123", "9999999998", "Zone 1", "collector"],
      ["Sunil Collector", "sunil@eco.com", "Collector@123", "9999999997", "Zone 2", "collector"],
      ["Riya Sharma", "riya@eco.com", "User@123", "9999999996", "Pune", "user"],
      ["Amit Patil", "amit@eco.com", "User@123", "9999999995", "Pune", "user"],
      ["Neha Joshi", "neha@eco.com", "User@123", "9999999994", "Pune", "user"]
    ];

    for (const [name, email, password, phone, address, role] of users) {
      const hash = await bcrypt.hash(password, 10);

      await connection.query(
        `INSERT INTO users
        (name, email, password_hash, phone, address, role)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        phone = VALUES(phone),
        address = VALUES(address),
        role = VALUES(role)`,
        [name, email, hash, phone, address, role]
      );
    }

    // 2. Demo areas
    const areas = [
      ["Zone 1 North", "411001"],
      ["Zone 2 South", "411002"],
      ["Zone 3 East", "411003"],
      ["Zone 4 West", "411004"],
      ["Zone 5 Central", "411005"]
    ];

    for (const area of areas) {
      await connection.query(
        "INSERT IGNORE INTO areas (name, pincode) VALUES (?, ?)",
        area
      );
    }

    // 3. Demo waste types
    const wasteTypes = [
      ["Wet waste", "Food and biodegradable waste", 50],
      ["Dry waste", "Paper, cardboard and dry recyclables", 40],
      ["E-waste", "Small electronic waste", 100],
      ["Plastic", "Plastic packaging and containers", 60],
      ["Garden waste", "Leaves and garden trimmings", 50]
    ];

    for (const item of wasteTypes) {
      await connection.query(
        "INSERT IGNORE INTO waste_types (name, description, price) VALUES (?, ?, ?)",
        item
      );
    }

    // 4. Get database IDs
    const [areaRows] = await connection.query(
      "SELECT id FROM areas ORDER BY id LIMIT 5"
    );

    const [wasteRows] = await connection.query(
      "SELECT id FROM waste_types ORDER BY id LIMIT 5"
    );

    const [userRows] = await connection.query(
      `SELECT id, email FROM users
       WHERE email IN (
         'riya@eco.com',
         'amit@eco.com',
         'neha@eco.com',
         'rahul@eco.com',
         'sunil@eco.com'
       )`
    );

    const userId = Object.fromEntries(
      userRows.map(row => [row.email, row.id])
    );

    // 5. Eight demo bookings with different statuses
    const demoBookings = [
      ["riya@eco.com", 0, 0, null, 1, "9-11 AM", "Sample pickup address 1, Pune", "Pending"],
      ["amit@eco.com", 1, 1, null, 2, "11-1 PM", "Sample pickup address 2, Pune", "Pending"],
      ["neha@eco.com", 2, 2, null, 3, "2-4 PM", "Sample pickup address 3, Pune", "Pending"],
      ["riya@eco.com", 3, 3, "rahul@eco.com", 4, "4-6 PM", "Sample pickup address 4, Pune", "Assigned"],
      ["amit@eco.com", 4, 4, "sunil@eco.com", 5, "9-11 AM", "Sample pickup address 5, Pune", "Assigned"],
      ["neha@eco.com", 0, 0, "rahul@eco.com", -2, "11-1 PM", "Sample pickup address 6, Pune", "Completed"],
      ["riya@eco.com", 1, 1, "sunil@eco.com", -3, "2-4 PM", "Sample pickup address 7, Pune", "Completed"],
      ["amit@eco.com", 2, 2, null, -4, "4-6 PM", "Sample pickup address 8, Pune", "Cancelled"]
    ];

    if (areaRows.length < 5 || wasteRows.length < 5) {
      throw new Error("Required areas or waste types are missing.");
    }

    for (let i = 0; i < demoBookings.length; i++) {
      const [
        email, areaIndex, wasteIndex, collectorEmail,
        dayOffset, timeSlot, address, status
      ] = demoBookings[i];

      const marker = `Seed demo booking ${i + 1}`;

      const [[existing]] = await connection.query(
        "SELECT id FROM bookings WHERE notes = ? LIMIT 1",
        [marker]
      );

      if (existing) continue;

      const pickupDate = new Date();
      pickupDate.setDate(pickupDate.getDate() + dayOffset);
      const dateString = pickupDate.toISOString().slice(0, 10);

      await connection.query(
        `INSERT INTO bookings
        (user_id, waste_type_id, area_id, collector_id,
         pickup_date, time_slot, address, notes, status, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId[email],
          wasteRows[wasteIndex].id,
          areaRows[areaIndex].id,
          collectorEmail ? userId[collectorEmail] : null,
          dateString,
          timeSlot,
          address,
          marker,
          status,
          status === "Completed" ? new Date() : null
        ]
      );
    }

    // 6. Three demo contact messages
    const demoMessages = [
      ["Asha", "asha@example.com", "Pickup enquiry",
        "Please tell me the available pickup timings."],

      ["Karan", "karan@example.com", "Service area",
        "Do you provide collection in my area?"],

      ["Meera", "meera@example.com", "Waste segregation",
        "Please share the rules for separating wet and dry waste."]
    ];

    for (const message of demoMessages) {
      const [[existing]] = await connection.query(
        `SELECT id FROM messages
         WHERE email = ? AND subject = ? AND message = ?
         LIMIT 1`,
        [message[1], message[2], message[3]]
      );

      if (!existing) {
        await connection.query(
          `INSERT INTO messages (name, email, subject, message)
           VALUES (?, ?, ?, ?)`,
          message
        );
      }
    }

    await connection.commit();

    console.log("Seed data inserted/verified successfully!");

  } catch (error) {
    await connection.rollback();
    console.error("Seed failed:", error.message);

  } finally {
    connection.release();
    await pool.end();
  }
}

seed();