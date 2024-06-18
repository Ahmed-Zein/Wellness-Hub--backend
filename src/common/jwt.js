const config = require("config");
const jwt = require("jsonwebtoken");

const logger = require("./logger");

const TOKEN_SECRET = config.get("TOKEN_SECRET");

exports.generateAccessToken = (payload, expiresIn) => {

  if (!TOKEN_SECRET) {
    throw Error("Empty key");
  }
  return jwt.sign(payload, TOKEN_SECRET, {
    expiresIn: expiresIn || "30d",
  });
};

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) {
      logger.error("jwt error: " + err);
      res.sendStatus(403).end();
      return;
    }
    req.user = user._id;

    next();
  });
};
