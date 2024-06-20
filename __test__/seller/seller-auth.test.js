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
  name: "john doe",
  email: "example@example.com",
  password: "123456789",
  address: "placeholder",
  SSN: "12341234123412341234",
  phone: {
    countryCode: "+020",
    number: "01010101010",
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
  const wrong_password = "1*******9";
  const wrong_email = "ex****@example.com";
  beforeEach(async () => {
    const res = await request(app)
      .post("/api/v1/seller/register")
      .send(testUser);
    expect(res.status).toBe(201);
  });
  it("should fail due to registering with existing email", async () => {
    const res = await request(app)
      .post("/api/v1/seller/register")
      .send(testUser);
    expect(res.status).toBe(409);
  });
  it("should fail registering with missing data", async () => {
    const body = {};
    const res = await request(app).post("/api/v1/seller/register").send(body);
    expect(res.status).toBe(422);
  });
  it("should log-in sellers", async () => {
    const body = { email: testUser.email, password: testUser.password };
    const res = await request(app).post("/api/v1/seller/login").send(body);
    expect(res.status).toBe(200);
  });
  it("should fail due to wrong password", async () => {
    const body = { email: testUser.email, password: wrong_password };
    const res = await request(app).post("/api/v1/seller/login").send(body);
    expect(res.status).toBe(401);
  });
  it("should fail due to unregisterd email", async () => {
    const body = { email: wrong_email, password: testUser.password };
    const res = await request(app).post("/api/v1/seller/login").send(body);
    expect(res.status).toBe(404);
  });
});

describe("getSellerData", () => {
  const fake_userid = "65d249efb0caf340385287fb";
  beforeEach(async () => {
    const res = await request(app)
      .post("/api/v1/Seller/register")
      .send(testUser);
    expect(res.status).toBe(201);
    testUser.userId = res.body.userId;
    testUser.token = res.body.token;
  });
  it("should handle non-existent user ID (404 Not Found)", async () => {
    const res = await request(app)
      .get("/api/v1/Seller/" + fake_userid)
      .set("Authorization", `Bearer ${testUser.token}`);

    expect(res.statusCode).toBe(404);
  });
  it("should return user data for a valid user ID", async () => {
    const res = await request(app)
      .get("/api/v1/Seller/" + testUser.userId)
      .set("Authorization", `Bearer ${testUser.token}`);

    expect(res.statusCode).toBe(200);
  });
});
