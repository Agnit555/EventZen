const express = require("express");
const cors = require("cors");
const axios = require("axios");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Attendee Service Running ");
});

// GET EVENTS
app.get("/events", async (req, res) => {
  try {
    const events = await axios.get("http://localhost:4000/api/events");
    res.json(events.data);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// GET ATTENDEES BY EVENT
app.get("/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    const bookings = await pool.query(
      "SELECT * FROM bookings WHERE event_id = $1",
      [eventId]
    );

    const users = await Promise.all(
      bookings.rows.map(async (b) => {
        const user = await axios.get(
          `http://localhost:4000/api/auth/user/${b.user_id}`
        );

        return {
          bookingId: b.id,
          username: user.data.username,
          status: b.status,
        };
      })
    );

    res.json(users);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// UPDATE STATUS
app.put("/status/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const updated = await pool.query(
      "UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *",
      [status, bookingId]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// DB test
pool.query("SELECT 1")
  .then(() => console.log("PostgreSQL Connected "))
  .catch(err => console.error(err));

// Server
app.listen(7200, () => {
  console.log("Attendee Service running on port 7200 🚀");
});