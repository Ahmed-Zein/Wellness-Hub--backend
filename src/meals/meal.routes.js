const express = require("express");
const { body, validationResult } = require("express-validator");

const MealController = require("./meal.contoller");
const ReviewController = require("./reviews.controller");
const { authenticateToken } = require("../common/jwt");

const router = express.Router();

const ping = (req, res) => {
  res.status(200).end();
};

const validationMiddleWare = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  console.log(errors);
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  return res
    .status(422)
    .json({ message: "validation error", errors: extractedErrors });
};

// Reviews endpoints

// Create a new meal
router.post(
  "/:mealId/reviews",
  authenticateToken,
  [
    body("content")
      .isLength({ min: 3 })
      .withMessage("Minimum review length is 3"),
  ],
  validationMiddleWare,
  ReviewController.addReview
);

// Update a meal
router.put("/:mealId/reviews", authenticateToken, ping);

// Delete a meal
router.delete("/:mealId/reviews", authenticateToken, ping);

// MEALS endpoints

// Get meal by ID
router.get("/:mealId", MealController.getMeal);

// Update a meal
router.put("/:mealId", authenticateToken, MealController.updateMeal);

// Delete a meal
router.delete("/:mealId", authenticateToken, MealController.deleteOneMeal);

// Get All meals
router.get("/", MealController.getAllMeals);

// Create a new meal
router.post(
  "/",
  authenticateToken,
  [
    body("seller").isLength({ min: 1 }).withMessage("seller id is required"),
    body("title").isLength({ min: 3 }).withMessage("minimum title lenght is 3"),
    body("description")
      .isLength({ min: 3 })
      .withMessage("minimum description lenght is 3"),
    body("price").isFloat().withMessage("price should not be empty"),
    body("tags")
      .isArray({ min: 1 })
      .withMessage("you should enter at least one tage"),
  ],
  validationMiddleWare,
  MealController.addMeal
);

module.exports = router;
// "https://english.ahram.org.eg/News/487813.aspx"
