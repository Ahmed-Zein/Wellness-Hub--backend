const express = require("express");

const { body } = require("express-validator");

const Customer = require("./customer.model");
const {
  register,
  addToWishlist,
  getUserData,
  getUserWishList,
  removeWishlist,
  getWeeklyPlan,
  addWeeklyPlan,
} = require("./customer.controller");
const { getCart, addToCart, deleteFromCart } = require("./cart.controller");
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
    body("phone").exists().withMessage("phone is required"),
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

//  add to user wishlist
router.post("/:userId/wishlist/:productId", authenticateToken, addToWishlist);

// remove from user wishlist
router.delete(
  "/:userId/wishlist/:productId",
  authenticateToken,
  removeWishlist
);

router.get("/:userId/cart", authenticateToken, getCart);
router.post(
  "/:userId/cart",
  authenticateToken,
  [
    body("itemId").exists().withMessage("item id is required"),
    body("quantity")
      .exists()
      .isInt({ min: 0, max: 100 })
      .withMessage("quantity is required"),
  ],
  validationMiddleware,
  addToCart
);
router.delete("/:userId/cart", authenticateToken, deleteFromCart);

router.get("/:userId/weekplan", authenticateToken, getWeeklyPlan);

router.post("/:userId/weekplan", authenticateToken, addWeeklyPlan);

module.exports = router;
