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

describe("getUserData", () => {
  const fake_userid = "65d249efb0caf340385287fb";
  beforeEach(async () => {
    const res = await request(app)
      .post("/api/v1/customer/register")
      .send(testUser);
    expect(res.status).toBe(201);
    testUser.userId = res.body.userId;
    testUser.token = res.body.accessToken;
  });
  it("should handle non-existent user ID (404 Not Found)", async () => {
    const res = await request(app)
      .get("/api/v1/customer/" + fake_userid)
      .set("Authorization", `Bearer ${testUser.token}`);

    expect(res.statusCode).toBe(404);
  });
  it("should return user data for a valid user ID", async () => {
    const res = await request(app)
      .get("/api/v1/customer/" + testUser.userId)
      .set("Authorization", `Bearer ${testUser.token}`);

    expect(res.statusCode).toBe(200);
  });
});

describe("addToWishList", () => {
  const fake_userid = "65d249edb0caf340385287fb";
  const fake_productId = "65d249efb9caf340385287fb";
  beforeEach(async () => {
    const res = await request(app)
      .post("/api/v1/customer/register")
      .send(testUser);
    expect(res.status).toBe(201);
    testUser.userId = res.body.userId;
    testUser.token = res.body.accessToken;
  });
  it("should handle non-existent user ID (404 Not Found)", async () => {
    const res = await request(app)
      .post(`/api/v1/customer/${fake_userid}/wishlist/${fake_productId}`)
      .set("Authorization", `Bearer ${testUser.token}`);
    expect(res.statusCode).toBe(404);
  });
  it("should handle non-existent product ID (404 Not Found)", async () => {
    const res = await request(app)
      .post(`/api/v1/customer/${testUser.userId}/wishlist/${fake_productId}`)
      .set("Authorization", `Bearer ${testUser.token}`);
    expect(res.statusCode).toBe(404);
  });
  // TODO: add a test to handle success route
});
