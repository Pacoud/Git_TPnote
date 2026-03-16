const app = require("./app");
const { pool } = require("./db");

const port = Number(process.env.PORT || 3000);

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Backend listening on port ${port}`);
});

async function shutdown() {
  try {
    await pool.end();
  } catch (error) {
    console.error("Error while closing database pool", error);
  }

  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
