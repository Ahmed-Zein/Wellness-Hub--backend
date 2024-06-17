const config = require("config");
const jwt = require("jsonwebtoken");

const logger = require("./logger");

const token = config.get("TOKEN_SECRET");

exports.generateAccessToken = (payload, key, expiresIn) => {
  // NOTE: this an intermediary solution before refactoring the function api
  // TODO: key in the function parameters remove it!
  key = token;
  if (!key) {
    throw Error("Empty key");
  }
  return jwt.sign(payload, key, {
    expiresIn: expiresIn || "30d",
  });
};

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, token, (err, user) => {
    if (err) {
      logger.error("jwt error: " + err);
      res.sendStatus(403).end();
      return;
    }
    req.user = user._id;

    next();
  });
};
