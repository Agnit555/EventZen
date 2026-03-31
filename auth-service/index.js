const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "mysecretkey";

//  PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "eventdb", 
  password: "@gnitP8081",
  port: 5433,
});

// REGISTER
app.post("/register", async (req, res) => {
  const { username, email, password, role, adminKey } = req.body;

  try {
    console.log("REGISTER BODY:", req.body);

    //  ADMIN CHECK
    if (role === "ADMIN") {
      if (adminKey !== "mysecretkey") {
        return res.status(403).json({ message: "Invalid admin key" });
      }
    }

    //  CHECK EXISTING USER
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    //  HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    //  INSERT USER
    await pool.query(
      "INSERT INTO users(username, email, password, role) VALUES($1, $2, $3, $4)",
      [username, email, hashedPassword, role || "USER"]
    );

    res.status(201).json({ message: "Registered successfully" });

  } catch (err) {
    console.error("REGISTER ERROR:", err); 
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username, 
        email: user.email,
        role: user.role,
      },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//  MIDDLEWARE
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) return res.status(403).send("No token");

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).send("Invalid token");
    req.user = decoded;
    next();
  });
}

app.get("/profile", verifyToken, (req, res) => {
  res.json(req.user);
});

//  ADD THIS RIGHT HERE
app.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json(err.message);
  }
});

app.listen(5000, () => {
  console.log("Auth service running on port 5000");
});
