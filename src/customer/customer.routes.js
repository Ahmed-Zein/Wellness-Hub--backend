const express = require("express");

const customerController = require("./customer.controller");
const { authenticateToken } = require("../common/jwt");
const { ping } = require("../common/utils");
const Customer = require("./customer.model");
const Product = require("../product/product.model");
const Meal = require("../meals/meal.model");

const router = express.Router();

router.post("/register", customerController.register);

router.post("/login", customerController.login);

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

router.get("/test", authenticateToken, ping);

module.exports = router;
