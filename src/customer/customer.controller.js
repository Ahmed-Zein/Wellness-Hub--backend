const bcrypt = require("bcryptjs");

const Customer = require("./customer.model");
const UserToken = require("../models/user.token.model");
const { generateAccessToken } = require("../common/jwt");

/**
 * @api {post} /api/v1/customer register new user
 * @apiName Register new Customer
 * @apiGroup Customer
 * @apiParam  {String} [name]
 * @apiParam  {String} [email]
 * @apiParam  {String} [phone]
 * @apiParam  {String} [address] optional
 * @apiSuccess (200) {Object} mixed `User` object
 */
exports.register = async (req, res, next) => {
  const { name, email, password, phone, address } = req.body;

  if (!(name && email && password && phone))
    return res.status(400).send({ message: "missing data" });

  try {
    const alreadyExists = await Customer.findOne({ email: email }).exec();
    if (alreadyExists) {
      return res.status(409).send({ message: "user already exists" });
    }

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

    res.status(201).send({
      message: "success",
      userId: result._id,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    res.status(500);
    next(e.message);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
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

    let refreshToken = await UserToken.findOne({ userId: customer._id }).select(
      "token"
    );
    if (!refreshToken) {
      refreshToken = generateAccessToken(
        { _id: customer._id },
        process.env.TOKEN_SECRET,
        "30d"
      );
    }

    const userToken = await new UserToken({
      userId: customer._id,
      token: refreshToken,
    }).save();

    res.send({
      message: "success",
      userId: customer._id,
      accessToken: accessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    next(err);
  }
};