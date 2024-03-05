const express = require("express");

const { body } = require("express-validator");

const Customer = require("./customer.model");
const customerController = require("./customer.controller");
const { authenticateToken } = require("../common/jwt");
const { findOneUser, login } = require("../common/auth");
const { validationMiddleware } = require("../common/middlewares");

const router = express.Router();

router.post("/register", customerController.register);

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
  findOneUser(Customer),
  login
);

// get user data
router.get("/:userId", authenticateToken, customerController.getUserData);

// get user wishlist
router.get(
  "/:userId/wishlist",
  authenticateToken,
  customerController.getUserWishList
);

// TODO: add to user wishlist
router.post(
  "/:userId/wishlist/:productId",
  authenticateToken,
  customerController.addToWishlist
);

module.exports = router;
