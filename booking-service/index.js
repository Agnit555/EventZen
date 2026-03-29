const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "eventdb",
  password: "@gnitP8081",
  port: 5433,
});


//  Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ msg: "No token" });

  // Handle "Bearer token"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, "mysecretkey");
    console.log("USER FROM TOKEN:", decoded); //  DEBUG HERE
    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message); //  DEBUG
    res.status(401).json({ msg: "Invalid token" });
  }
};

app.use((req, res, next) => {
  console.log("HEADERS:", req.headers);
  next();
});

// POST /bookings
app.post("/bookings", verifyToken, async (req, res) => {
  const { event_id } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO bookings(user_id, event_id) VALUES($1, $2) RETURNING *",
      [req.user.userId, event_id]
    );

    res.json({
      msg: "Booked!",
      booking: result.rows[0],
    });

  } catch (err) {
    console.error(err);

    // ✅ ADD THIS HERE
    if (err.code === "23505") {
      return res.status(400).json({ msg: "Already booked" });
    }

    res.status(500).json({ error: "DB error" });
  }
});

// GET /bookings
app.get("/bookings", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          b.id,
          b.status,
          e.title,
          e.venue,
          e.date
       FROM bookings b
       JOIN event e ON b.event_id = e.id
       WHERE b.user_id = $1 AND b.status = 'approved'`,
      [req.user.userId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

app.put("/bookings/:id/status", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Only ADMIN allowed
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ msg: "Access denied" });
  }

  // ✅ ADD THIS VALIDATION
  const validStatuses = ["pending", "approved", "rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ msg: "Invalid status value" });
  }

  try {
    const result = await pool.query(
      "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    res.json({
      msg: "Status updated",
      booking: result.rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

app.listen(6500, () => {
  console.log("Booking Service running on port 6500");
});