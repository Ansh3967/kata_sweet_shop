const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app"); // Your Express app
const SweetModel = require("../src/models/SweetModel");

let mongoServer;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  await SweetModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Sweet Controller Tests", () => {
  test("should add a sweet", async () => {
    const sweet = {
      name: "Kaju Katli",
      category: "Nut-Based",
      price: 50,
      quantity: 20,
    };

    const res = await request(app).post("/sweets").send(sweet).expect(201);
    expect(res.body.name).toBe("Kaju Katli");

    const sweetInDB = await SweetModel.findOne({ name: "Kaju Katli" });
    expect(sweetInDB).toBeTruthy();
  });

  test("should delete a sweet by ID", async () => {
    const sweet = await SweetModel.create({
      name: "Kaju Katli",
      category: "Nut-Based",
      price: 50,
      quantity: 20,
    });

    await request(app).delete(`/sweets/${sweet._id}`).expect(204);
    const deleted = await SweetModel.findById(sweet._id);
    expect(deleted).toBeNull();
  });

  test("should return 404 if sweet does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/sweets/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  test("should search sweets by name", async () => {
    await SweetModel.create([
      { name: "Kaju Katli", category: "Nut-Based", price: 50, quantity: 20 },
      { name: "Gajar Halwa", category: "Veg", price: 30, quantity: 15 },
    ]);

    const res = await request(app).get("/sweets/search?name=Gajar");
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Gajar Halwa");
  });

  test("should search sweets by category", async () => {
    await SweetModel.create([
      { name: "Kaju Katli", category: "Nut-Based", price: 50, quantity: 20 },
      {
        name: "Gajar Halwa",
        category: "Vegetable-Based",
        price: 30,
        quantity: 15,
      },
    ]);

    const res = await request(app).get(
      "/sweets/search?category=Vegetable-Based"
    );
    expect(res.body.length).toBe(1);
    expect(res.body[0].category).toBe("Vegetable-Based");
  });

  test("should search sweets within price range", async () => {
    await SweetModel.create([
      { name: "Kaju Katli", category: "Nut-Based", price: 50, quantity: 20 },
      { name: "Gajar Halwa", category: "Vegetable", price: 30, quantity: 15 },
    ]);

    const res = await request(app).get(
      "/sweets/search?minPrice=20&maxPrice=40"
    );
    expect(res.body.length).toBe(1);
    expect(res.body[0].price).toBe(30);
  });

  test("should reduce quantity on purchase", async () => {
    const sweet = await SweetModel.create({
      name: "Gajar Halwa",
      category: "Vegetable",
      price: 30,
      quantity: 15,
    });

    const res = await request(app)
      .post(`/sweets/${sweet._id}/purchase`)
      .send({ quantity: 3 })
      .expect(200);

    expect(res.body.quantity).toBe(12);
  });

  test("should return error if stock is insufficient", async () => {
    const sweet = await SweetModel.create({
      name: "Gajar Halwa",
      category: "Vegetable",
      price: 30,
      quantity: 15,
    });

    const res = await request(app)
      .post(`/sweets/${sweet._id}/purchase`)
      .send({ quantity: 20 })
      .expect(400);

    expect(res.body.error).toMatch(/not enough stock/i);
  });
});
