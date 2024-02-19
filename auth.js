const bcrypt = require("bcryptjs");
const User = require("../resources/user/user.model");
const jwt = require("jsonwebtoken");

exports.newToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.jwtSecret, {
    expiresIn: process.env.jwtExp,
  });
};

exports.verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.jwtSecret, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });

exports.protect = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    console.error("jwtError");
    return res.status(401).end();
  }

  const token = bearer.split("Bearer ")[1].trim();
  let payload;

  try {
    payload = await this.verifyToken(token);
  } catch (e) {
    console.error(e);
    return res.status(401).end();
  }

  const user = await User.findById(payload.id)
    .select("-password")
    .lean()
    .exec();

  if (!user) {
    return res.status(401).end();
  }

  req.user = user;
  next();
};
