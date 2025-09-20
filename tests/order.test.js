const request = require("supertest");
const { expect } = require("chai");
const bcrypt = require("bcrypt");
const app = require("../app");
const {
  sequelize,
  User,
  Restaurant,
  MenuItem,
  Order,
  OrderItem,
} = require("../models");

let userToken, adminToken, orderId, restaurantId, menuItemId;

describe("Order API Integration", () => {
  before(async () => {
    await sequelize.sync({ force: true });

    await request(app).post("/auth/register").send({
      name: "John Doe",
      email: "user@test.com",
      password: "password123",
    });

    const loginRes = await request(app).post("/auth/login").send({
      email: "user@test.com",
      password: "password123",
    });
    userToken = loginRes.body.token;

    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin User",
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin",
    });

    const adminLoginRes = await request(app).post("/auth/login").send({
      email: "admin@test.com",
      password: "admin123",
    });
    adminToken = adminLoginRes.body.token;

    const restaurant = await Restaurant.create({
      name: "Pizza Place",
      location: "City Center",
    });
    restaurantId = restaurant.id;

    const menuItem = await MenuItem.create({
      name: "Margherita Pizza",
      price: 10,
      restaurantId,
    });
    menuItemId = menuItem.id;
  });

  it("should allow a user to place a new order", async () => {
    const res = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        restaurantId,
        items: [{ menuItemId, quantity: 2 }],
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("id");
    expect(res.body.OrderItems).to.be.an("array");
    orderId = res.body.id;
  });

  it("should allow an admin to update order status", async () => {
    const res = await request(app)
      .patch(`/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "preparing" });

    expect(res.status).to.equal(200);
    expect(res.body.order).to.have.property("status", "preparing");
  });

  it("should forbid a normal user from updating order status", async () => {
    const res = await request(app)
      .patch(`/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ status: "delivered" });

    expect(res.status).to.equal(403);
    expect(res.body).to.have.property(
      "error",
      "Only admin can update order status"
    );
  });
});
