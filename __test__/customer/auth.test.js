require("dotenv").config();

const jwt = require("jsonwebtoken");
const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../server");
const { generateAccessToken } = require("../../src/common/jwt");
const logger = require("../../src/common/logger");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
}, 90000000);

afterAll(async () => {
  await mongoose.connection.close();
});

describe("JWT:", () => {
    test("should create new jwt", () => {
      const id = 123;
      const payload = { id: 123 };
      const token = generateAccessToken(payload, process.env.TOKEN_SECRET);
      const accessToken = jwt.verify(token, process.env.TOKEN_SECRET);

      expect(accessToken.id).toBe(id);
    });
});

describe("Authentication:", () => {
  it("should fail due to registering with existing email", async () => {
    const body = {
      name: "sdfsfdsa",
      email: "test279@test.com",
      password: "123456789",
      address: "placeholder",
      phone: {
        countryCode: "+020",
        number: "01010101010",
      },
    };
    const res = await request(app).post("/api/v1/customer/register").send(body);
    expect(res.status).toBe(409);
  });
  it("should register successfully", async () => {
    const body = {
      name: "sdfsfdsa",
      email: "test279xx" + Math.random() + "@test.com",
      password: "123456789",
      address: "placeholder",
      phone: {
        countryCode: "+020",
        number: "01010101010",
      },
    };
    const res = await request(app).post("/api/v1/customer/register").send(body);
    expect(res.status).toBe(201);
  });
  it("should fail registering with missing data", async () => {
    const body = {};
    const res = await request(app).post("/api/v1/customer/register").send(body);
    expect(res.status).toBe(422);
  });
  it("should log-in customers", async () => {
    const body = { email: "test279@test.com", password: "123456789" };
    const res = await request(app).post("/api/v1/customer/login").send(body);
    expect(res.status).toBe(200);
  });
  it("should fail due to wrong password", async () => {
    const body = { email: "test279@test.com", password: "1xxxxxx89" };
    const res = await request(app).post("/api/v1/customer/login").send(body);
    expect(res.status).toBe(401);
  });
  it("should fail due to unregisterd email", async () => {
    const body = { email: "txxxxx9@test.com", password: "1xxxxxx89" };
    const res = await request(app).post("/api/v1/customer/login").send(body);
    expect(res.status).toBe(404);
  });
});
