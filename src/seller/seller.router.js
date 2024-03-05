const express = require("express");

const bcrypt = require("bcryptjs");
const { body } = require("express-validator");

const Seller = require("./seller.model");
const UserToken = require("../models/user.token.model");
const logger = require("../common/logger");
const { generateAccessToken } = require("../common/jwt");
const { login, findOneUser } = require("../common/auth");
const { validationMiddleware } = require("../common/middlewares");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password, SSN, phone, address } = req.body;

  if (!(name && email && password && phone))
    return res.status(400).send({ message: "missing data" });

  const alreadyExists = await require("./seller.model")
    .findOne({ email: email })
    .exec();
  if (alreadyExists) {
    return res.status(400).send({ message: "user already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    if (!hashedPassword) throw Error("server error");
    const seller = await require("./seller.model").create({
      name: name,
      email: email,
      password: hashedPassword,
      SSN: SSN,
      phone: phone,
      address: address,
    });

    // const token = this.newToken(user);
    // res.status(201).send({ token });
    const result = await seller.save();
    res
      .status(201)
      .send({ message: "success", userId: result._id, token: "dummydata" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: e.message });
  }
});

router.post(
  "/login",
  [
    body("email")
      .exists()
      .withMessage("email is required")
      .trim()
      .isEmail()
      .withMessage("invalid email"),
  ],
  validationMiddleware,
  findOneUser(Seller),
  login
);

// Get /sellers  endpoint to get the data of a specific  seller
router.get("/:sellerid", async (req, res) => {
  try {
    const seller = await require("./seller.model").findById(
      req.params.sellerid
    );
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      meals: seller.meals,
      products: seller.products,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
