const express = require("express");

const Customer = require("./customer.model");
const bcrypt = require("bcryptjs");
// const controller = require("./snippet.controller");
// const protect = require("../../utils/auth").protect;

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password, phone, userImage, address } = req.body;

  if (!(name && email && password && phone))
    return res.status(400).send({ message: "missing data" });

  const alreadyExists = await Customer.findOne({ email: email }).exec();
  if (alreadyExists) {
    return res.status(400).send({ message: "user already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    if (!hashedPassword) throw Error("server error");
    const customer = await Customer.create({
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
      userImage: userImage,
      address: address,
    });

    // const token = this.newToken(user);
    // res.status(201).send({ token });
    const result = await customer.save();
    res
      .status(201)
      .send({ message: "success", userId: result._id, token: "dummydata" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: e.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const customer = await Customer.findOne({ email: email })
    .select("email password _id")
    .exec();

  if (!customer) {
    return res.status(401).send({ message: "email not exist" });
  }

  const isCorrectPassword = await bcrypt.compare(password, customer.password);
  if (!isCorrectPassword) {
    return res.status(401).send({ message: "wrong password" });
  }
  //   const token = this.newToken(customer);
  //   res.status(200).send({ token });

  res.send({ message: "success", user: customer._id, token: "dummydata" });
});

module.exports = router;
