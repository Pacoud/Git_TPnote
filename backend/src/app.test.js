const request = require("supertest");

jest.mock("./db", () => ({
  query: jest.fn().mockResolvedValue({ rows: [{ result: 1 }] })
}));

const db = require("./db");
const app = require("./app");

describe("GET /api/health", () => {
  it("returns a healthy status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
    expect(db.query).toHaveBeenCalledWith("SELECT 1");
  });
});
