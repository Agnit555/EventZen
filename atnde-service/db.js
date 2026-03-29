const { Pool } = require("pg");

console.log(" DB FILE LOADING...");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "eventdb",
  password: "@gnitP8081", // ⚠️ PUT YOUR REAL PASSWORD
  port: 5433,
});

// Optional test
pool.on("connect", () => {
  console.log(" PostgreSQL pool connected");
});

pool.on("error", (err) => {
  console.error(" Unexpected DB Error", err);
});

module.exports = pool;