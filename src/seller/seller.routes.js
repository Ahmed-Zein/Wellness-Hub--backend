const express = require("express");

const { body } = require("express-validator");

const Seller = require("./seller.model");
const { login, findOneUser } = require("../common/auth");
const { validationMiddleware } = require("../common/middlewares");
const { register, getSellerData } = require("./seller.controller");
const { authenticateToken } = require("../common/jwt");

const router = express.Router();

router.post("/register", register);

router.post(
  "/login",
  [
    body("email")
      .exists()
      .withMessage("email is required")
      .trim()
      .isEmail()
      .withMessage("invalid email"),
  ],
  validationMiddleware,
  findOneUser(Seller),
  login
);

// Get /sellers  endpoint to get the data of a specific  seller
router.get("/:sellerId", getSellerData);

module.exports = router;
