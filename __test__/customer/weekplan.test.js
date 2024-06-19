const config = require("config");
const jwt = require("jsonwebtoken");
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../../server");
const { generateAccessToken } = require("../../src/common/jwt");

let mongoServer;
const test_token = config.get("TOKEN_SECRET");

const testUser = {
  name: "John Doe",
  email: "test.user@example.com",
  password: "secure_password123",
  address: "123 Main St",
  phone: {
    countryCode: "+1",
    number: "555-555-5555",
  },
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongoServer) {
    mongoServer.stop();
  }
});

describe("Authentication:", () => {
  beforeEach(async () => {
    const res = await request(app)
      .post("/api/v1/customer/register")
      .send(testUser);
    expect(res.status).toBe(201);
    testUser.userId = res.body.userId;
    testUser.token = res.body.accessToken;
  });
  it("should fetch the user weekplan", async () => {
    const res = await request(app)
      .get(`/api/v1/customer/${testUser.userId}/weekplan`)
      .set("Authorization", `Bearer ${testUser.token}`);
    expect(res.status).toBe(200);
    expect(res.body.weekplan.length).toBe(7);
  });
  it("should add to the user weekplan", async () => {
    const res = await request(app)
      .post(`/api/v1/customer/${testUser.userId}/weekplan`)
      .send({
        weekplan: [
          {
            snacks: [],
            day: "monday",
            breakfast: ["66718438f25140f6136f7d62"],
            lunch: [],
            dinner: [],
          },
        ],
      })
      .set("Authorization", `Bearer ${testUser.token}`);
    expect(res.status).toBe(200);
    expect(res.body.weekplan.length).toBe(7);
  });
});
