const express = require("express");
const { body } = require("express-validator");

// Import controllers and middleware
const mealController = require("./meal.contoller");
const reviewController = require("./reviews.controller");
const { authenticateToken } = require("../common/jwt");
const { ping, validationMiddleware } = require("../common/utils");

const router = express.Router();

// Define constants for validation messages
const MINIMUM_REVIEW_LENGTH = 3;
const MINIMUM_TITLE_LENGTH = 3;
const MINIMUM_DESCRIPTION_LENGTH = 3;
const MINIMUM_TAG_COUNT = 1;

// Reviews endpoints

/**
 * POST /api/v1/meals/:mealId/reviews
 * Create a new review for a specific meal.
 * Requires authentication token.
 * Request Body: { content: string }
 * Response: Newly created review object
 */
router.post(
  "/:mealId/reviews",
  authenticateToken,
  [
    body("content")
      .isLength({ min: 3 })
      .withMessage("Minimum review length is 3"),
  ],
  validationMiddleware,
  reviewController.addReview
);

// TODO: Update a review for a specific meal (Placeholder route)
router.put("/:mealId/reviews", authenticateToken, ping);

// TODO: Delete a review for a specific meal (Placeholder route)
router.delete("/:mealId/reviews", authenticateToken, ping);

// Meals Endpoints

/**
 * GET /api/v1/meals/:mealId
 * Get details of a specific meal by its ID.
 * Response: Meal object
 */
router.get("/:mealId", mealController.getMeal);

/**
 * PUT /api/v1/meals/:mealId
 * Update details of a specific meal by its ID.
 * Requires authentication token and seller authorization.
 * Request Body: Updated meal details
 * Response: Updated meal object
 */
router.put("/:mealId", authenticateToken, mealController.updateMeal);

/**
 * DELETE /api/v1/meals/:mealId
 * Delete a specific meal by its ID.
 * Requires authentication token and seller authorization.
 * Response: Success message
 */
router.delete("/:mealId", authenticateToken, mealController.deleteOneMeal);

/**
 * GET /api/v1/meals
 * Get all meals.
 * Response: Array of meal objects
 */
router.get("/", mealController.getAllMeals);

/**
 * POST /api/v1/meals
 * Create a new meal.
 * Requires authentication token.
 * Request Body: { seller: string, title: string, description: string, price: number, tags: string[] }
 * Response: Newly created meal object
 */
router.post(
  "/",
  authenticateToken,
  [
    body("seller").exists().withMessage("Seller ID is required"),
    body("title")
      .isLength({ min: MINIMUM_TITLE_LENGTH })
      .withMessage(`Minimum title length is ${MINIMUM_TITLE_LENGTH}`),
    body("description")
      .isLength({ min: MINIMUM_DESCRIPTION_LENGTH })
      .withMessage(
        `Minimum description length is ${MINIMUM_DESCRIPTION_LENGTH}`
      ),
    body("price").isFloat().withMessage("Price should be a valid number"),
    body("tags")
      .isArray({ min: MINIMUM_TAG_COUNT })
      .withMessage(`You should enter at least ${MINIMUM_TAG_COUNT} tag`),
  ],
  validationMiddleware,
  mealController.addMeal
);

module.exports = router;
// "https://english.ahram.org.eg/News/487813.aspx"
