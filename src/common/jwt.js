const jwt = require("jsonwebtoken");
const logger = require("./logger");

exports.generateAccessToken = (payload, key, expiresIn) => {
  console.log(payload);
  console.log(key);
  console.log(expiresIn);
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

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      logger.error("jwt error: " + err);
      res.sendStatus(403).end();
      return;
    }
    req.user = user._id;

    next();
  });
};
