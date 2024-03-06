const express = require("express");

const { body } = require("express-validator");

const Customer = require("./customer.model");
const {
  register,
  addToWishlist,
  getUserData,
  getUserWishList,
} = require("./customer.controller");
const { authenticateToken } = require("../common/jwt");
const { findOneUser, login } = require("../common/auth");
const { validationMiddleware } = require("../common/middlewares");

const router = express.Router();

router.post(
  "/register",
  [
    body("name")
      .isLength({ min: 8 })
      .withMessage("name should be between 8 to 50 characters"),
    body("email").isEmail().withMessage("check you email"),
  ],
  validationMiddleware,
  register
);

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
router.get("/:userId", authenticateToken, getUserData);

// get user wishlist
router.get("/:userId/wishlist", authenticateToken, getUserWishList);

// TODO: add to user wishlist
router.post("/:userId/wishlist/:productId", authenticateToken, addToWishlist);

module.exports = router;
