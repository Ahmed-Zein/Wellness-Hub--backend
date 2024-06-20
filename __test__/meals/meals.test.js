const config = require("config");
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
const testMeal = {
  title: "Meal title",
  images: [
    "https://images.eatthismuch.com/img/34096_erin_m_f434d8cd-93af-4dde-86b5-11fa49b476b0.png",
  ],
  description: "meal description",
  category: "pasta",
  price: 12.99,
  ingredients: ["Egg"],
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

beforeEach(async () => {
  const res = await request(app).post("/api/v1/Seller/register").send(testUser);
  expect(res.status).toBe(201);
  testUser.userId = res.body.userId;
  testUser.token = res.body.token;
  testMeal.seller = testUser.userId;
});

describe("addMeal", () => {
  it("should add a meal", async () => {
    const res = await request(app)
      .post("/api/v1/meals")
      .set("Authorization", `Bearer ${testUser.token}`)
      .send(testMeal);
    expect(res.status).toBe(201);
  });
  it("should fail due to wrong seller id in the meal body", async () => {
    const fake_meal = {
      ...testMeal,
      seller: "111111111111111111111111",
    };
    const res = await request(app)
      .post("/api/v1/meals")
      .set("Authorization", `Bearer ${testUser.token}`)
      .send(fake_meal);
    expect(res.status).toBe(403);
  });
});
describe("getAllMeals", () => {
  beforeEach(async () => {
    const res = await request(app)
      .post("/api/v1/meals")
      .set("Authorization", `Bearer ${testUser.token}`)
      .send(testMeal);
    expect(res.status).toBe(201);
    testMeal.mealID = res.body.id;
  });
  it("should get all meals", async () => {
    const res = await request(app).get("/api/v1/meals/");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });
});

describe("getOneMeal", () => {
  const fake_mealID = "6670d59acb32f53577025746";
  beforeEach(async () => {
    const res = await request(app)
      .post("/api/v1/meals")
      .set("Authorization", `Bearer ${testUser.token}`)
      .send(testMeal);
    expect(res.status).toBe(201);
    testMeal.mealID = res.body.id;
  });
  it("should get a meals", async () => {
    const res = await request(app).get("/api/v1/meals/" + testMeal.mealID);
    expect(res.statusCode).toBe(200);
  });
  it("should fail due to wrong mealid", async () => {
    const res = await request(app).get("/api/v1/meals/" + fake_mealID);
    expect(res.statusCode).toBe(404);
  });
});
