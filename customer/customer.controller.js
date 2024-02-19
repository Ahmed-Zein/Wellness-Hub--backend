const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Customer = require("./customer.model");
const UserToken = require("../models/user.token.model");
const { authenticateToken, generateAccessToken } = require("../utils");

exports.register = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

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
      address: address,
    });

    const result = await customer.save();

    const accessToken = generateAccessToken(
      { _id: customer._id },
      process.env.TOKEN_SECRET
    );

    const refreshToken = generateAccessToken(
      { _id: customer._id },
      process.env.TOKEN_SECRET,
      "30d"
    );

    await new UserToken({ userId: customer._id, token: refreshToken }).save();

    res
      .status(201)
      .send({ message: "success", userId: result._id, token: accessToken });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: e.message });
  }
};

exports.login = async (req, res) => {
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

  const accessToken = generateAccessToken(
    { _id: customer._id },
    process.env.TOKEN_SECRET
  );

  let refreshToken = await UserToken.findOne({ userId: customer._id });
  if (!refreshToken) {
    refreshToken = generateAccessToken(
      { _id: customer._id },
      process.env.TOKEN_SECRET,
      "30d"
    );
  }

  const token= await new UserToken({ userId: customer._id, token: refreshToken }).save();

  res.send({
    message: "success",
    user: customer._id,
    accessToken: accessToken,
  });
};
