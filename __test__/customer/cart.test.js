require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../server");

const userId = "65d249efb0caf340385285fb";

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 90000000);

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Cart:", () => {
  it("should get customer cart", async () => {
    const res = await request(app)
      .get("/api/v1/customer/" + userId + "/cart")
      .set("authorization", process.env.CUST_TOKEN);
    expect(res.status).toBe(200);
  });
  it("should not add to customer cart", async () => {
    // missging quantity attribute
    const body = {
      itemId: "65e6d695eeaa0ae29ed8df21",
    };
    const res = await request(app)
      .post("/api/v1/customer/" + userId + "/cart")
      .set("authorization", process.env.CUST_TOKEN)
      .send(body);
    expect(res.status).toBe(422);
  });
  it("should add to customer cart", async () => {
    const body = {
      itemId: "65e6d695eeaa0ae29ed8df21",
      quantity: 8,
    };
    const res = await request(app)
      .post("/api/v1/customer/" + userId + "/cart")
      .set("authorization", process.env.CUST_TOKEN)
      .send(body);
    expect(res.status).toBe(200);
  });
  it("should update customer cart", async () => {
    const body = {
      itemId: "65e6d695eeaa0ae29ed8df21",
      quantity: 5,
    };
    const res = await request(app)
      .post("/api/v1/customer/" + userId + "/cart")
      .set("authorization", process.env.CUST_TOKEN)
      .send(body);
    expect(res.status).toBe(200);
  });
  it("should delete from customer cart", async () => {
    const body = {
      itemId: "65e6d695eeaa0ae29ed8df21",
    };
    const res = await request(app)
      .del("/api/v1/customer/" + userId + "/cart")
      .set("authorization", process.env.CUST_TOKEN)
      .send(body);
    expect(res.status).toBe(200);
  });
});
