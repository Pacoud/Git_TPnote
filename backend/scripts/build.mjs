import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";

if (existsSync("dist")) {
  rmSync("dist", { recursive: true, force: true });
}

mkdirSync("dist", { recursive: true });
cpSync("src", "dist", { recursive: true });

console.log("Backend build completed.");
