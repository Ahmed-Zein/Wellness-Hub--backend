require("dotenv").config();

const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../../src/common/jwt");

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

  describe("token authentication", () => {
    test("creates new jwt from user", () => {
      const id = 123;
      const payload = { id: 123 };
      const token = generateAccessToken(payload, process.env.TOKEN_SECRET);
      const accessToken = jwt.verify(token, process.env.TOKEN_SECRET);

      expect(accessToken.id).toBe(id);
    });
  });
  //   describe("verifyToken", () => {
  //     test("validates jwt and returns payload", async () => {
  //       const id = 1234;
  //       const token = jwt.sign({ id }, config.secrets.jwt);
  //       const user = await verifyToken(token);
  //       expect(user.id).toBe(id);
  //     });
  //   });
});
