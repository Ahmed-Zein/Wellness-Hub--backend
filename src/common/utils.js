const { validationResult } = require("express-validator");
const logger = require("./logger");

exports.ping = (req, res) => {
  res.status(200).end();
};

// Middleware for handling validation errors
exports.validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => {
    logger.error(err.msg);
    extractedErrors.push({ [err.path]: err.msg });
  });

  return res
    .status(422)
    .json({ message: "validation error", errors: extractedErrors });
};

exports.transformMealToClientFormat = (meal) => {
  return {
    id: meal._id,
    seller: meal.seller,
    title: meal.title,
    images: meal.images,
    description: meal.description,
    tags: meal.tags,
    reviews: meal.reviews.for,
  };
};
