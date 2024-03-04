const express = require("express");

const bcrypt = require("bcryptjs");
const { body } = require("express-validator");

const Seller = require("./seller.model");
const UserToken = require("../models/user.token.model");

const logger = require("../common/logger");
const { validationMiddleware } = require("../common/utils");
const { generateAccessToken } = require("../common/jwt");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password, SSN, phone, address } = req.body;

  if (!(name && email && password && phone))
    return res.status(400).send({ message: "missing data" });

  const alreadyExists = await Seller.findOne({ email: email }).exec();
  if (alreadyExists) {
    return res.status(400).send({ message: "user already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    if (!hashedPassword) throw Error("server error");
    const seller = await Seller.create({
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
  async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const seller = await Seller.findOne({ email: email })
        .select("email password _id")
        .exec();

      logger.info(email + password);
      if (!seller) {
        logger.error("email: " + email + " no exist");
        return res.status(401).send({ message: "email not exist" });
      }

      const isCorrectPassword = await bcrypt.compare(password, seller.password);
      if (!isCorrectPassword) {
        logger.error("wrong password");
        return res.status(401).send({ message: "wrong password" });
      }

      const accessToken = generateAccessToken(
        { _id: seller._id },
        process.env.TOKEN_SECRET
      );

      let refreshToken = await UserToken.findOne({
        userId: seller._id,
      }).select("token");
      if (!refreshToken) {
        refreshToken = generateAccessToken(
          { _id: seller._id },
          process.env.TOKEN_SECRET,
          "30d"
        );
      }

      const userToken = await new UserToken({
        userId: seller._id,
        token: refreshToken,
      }).save();

      res.send({
        message: "success",
        userId: seller._id,
        accessToken: accessToken,
        refreshToken: refreshToken.token,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Get /sellers  endpoint to get the data of a specific  seller
router.get("/:sellerid", async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.sellerid);
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
