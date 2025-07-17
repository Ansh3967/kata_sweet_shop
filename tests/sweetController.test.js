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
});
