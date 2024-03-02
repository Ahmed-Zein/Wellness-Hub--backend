const express = require("express");

const customerController = require("./customer.controller");
const { authenticateToken } = require("../common/jwt");
const { body } = require("express-validator");
const { validationMiddleware } = require("../common/utils");

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
  customerController.login
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
