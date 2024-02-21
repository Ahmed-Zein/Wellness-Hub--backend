const express = require("express");
const { check, validationResult } = require("express-validator");

const MealController = require("./meal.contoller");
const ReviewController = require("./reviews.controller");
const { authenticateToken } = require("../common/jwt");

const router = express.Router();

const ping = (req, res) => {
  res.status(200).end();
};

// Reviews endpoints

// Create a new meal
router.post("/:mealId/reviews", authenticateToken, ReviewController.addReview);

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
router.post("/", authenticateToken, MealController.addMeal);

module.exports = router;
// "https://english.ahram.org.eg/News/487813.aspx"
