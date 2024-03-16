require("dotenv").config();

const jwt = require("jsonwebtoken");
const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../server");
const { generateAccessToken } = require("../../src/common/jwt");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
}, 5000000);

afterAll(async () => {
  await mongoose.connection.close();
});

describe("JWT:", () => {
  describe("newToken", () => {
    test("creates new jwt from userid", () => {
      const id = 123;
      const payload = { id: 123 };
      const token = generateAccessToken(payload, process.env.TOKEN_SECRET);
      const accessToken = jwt.verify(token, process.env.TOKEN_SECRET);

      expect(accessToken.id).toBe(id);
    });
  });
});

describe("Authentication:", () => {
  it("registering with existing email fails with 409 ", async () => {
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
  it("creating a new customer accoutn", async () => {
    const body = {
      name: "sdfsfdsa",
      email: "test279xx@test.com",
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
});
