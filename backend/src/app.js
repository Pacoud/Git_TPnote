const express = require("express");
const db = require("./db");

const app = express();

app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "database unavailable"
    });
  }
});

module.exports = app;
