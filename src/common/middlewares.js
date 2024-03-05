const { validationResult } = require("express-validator");
const logger = require("./logger");

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

exports.ping = (req, res) => {
  res.status(200).end();
};
