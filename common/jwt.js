const jwt = require("jsonwebtoken");

exports.generateAccessToken = (payload, key, expiresIn) => {
  if (!key) {
    throw Error("Empty key");
  }
  return jwt.sign(payload, key, {
    expiresIn: expiresIn || "1d",
  });
};

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log("jwt error: " + err);

    if (err) return res.sendStatus(403).end();

    req.user = user;

    next();
  });
};
