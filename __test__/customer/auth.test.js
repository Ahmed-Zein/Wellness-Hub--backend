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

describe("JWT:", () => {
  it("should create new jwt", () => {
    const id = 123;
    const payload = { id: 123 };
    const token = generateAccessToken(payload);
    const accessToken = jwt.verify(token, test_token);
    expect(accessToken.id).toBe(id);
  });
});

describe("Authentication:", () => {
  beforeEach(async () => {
    const res = await request(app)
      .post("/api/v1/customer/register")
      .send(testUser);
    expect(res.status).toBe(201);
  });
  it("should fail due to registering with existing email", async () => {
    const res = await request(app)
      .post("/api/v1/customer/register")
      .send(testUser);
    expect(res.status).toBe(409);
  });
  it("should fail registering with missing data", async () => {
    const body = {};
    const res = await request(app).post("/api/v1/customer/register").send(body);
    expect(res.status).toBe(422);
  });
  it("should log-in customers", async () => {
    const body = { email: testUser.email, password: testUser.password };
    const res = await request(app).post("/api/v1/customer/login").send(body);
    expect(res.status).toBe(200);
  });
  it("should fail due to wrong password", async () => {
    const body = { email: testUser.email, password: "wrongpassword" };
    const res = await request(app).post("/api/v1/customer/login").send(body);
    expect(res.status).toBe(401);
  });
  it("should fail due to unregisterd email", async () => {
    const body = { email: "txxxxx9@test.com", password: "1xxxxxx89" };
    const res = await request(app).post("/api/v1/customer/login").send(body);
    expect(res.status).toBe(404);
  });
});