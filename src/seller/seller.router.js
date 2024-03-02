const express = require("express");

const Seller = require("./seller.model");
const bcrypt = require("bcryptjs");
const logger = require("../common/logger");
const { body } = require("express-validator");
const { validationMiddleware } = require("../common/utils");
// const controller = require("./snippet.controller");
// const protect = require("../../utils/auth").protect;

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
  async (req, res) => {
    const { email, password } = req.body;
    logger.info(email+ password);

    const customer = await Seller.findOne({ email: email })
      .select("email password _id")
      .exec();

    if (!customer) {
      logger.error("email not exist");
      return res.status(401).send({ message: "seller: email not exist" });
    }

    const isCorrectPassword = await bcrypt.compare(password, customer.password);
    if (!isCorrectPassword) {
      logger.error("wrong password");
      return res.status(401).send({ message: "seller: wrong password" });
    }

    logger.info("successfull login");
    res.send({
      message: "success az",
      user: customer._id,
      token: "storethistokenfornow",
    });
  }
);

module.exports = router;
