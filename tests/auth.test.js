const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../config/db");
const { expect } = require("chai");

describe("Auth api", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).to.equal(201);
  });

  it("should login the user and return a token", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
  });
});
