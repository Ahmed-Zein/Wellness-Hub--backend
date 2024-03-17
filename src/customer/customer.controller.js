const bcrypt = require("bcryptjs");

const Meal = require("../meals/meal.model");
const Product = require("../product/product.model");
const Customer = require("./customer.model");
const UserToken = require("../models/user.token.model");

const logger = require("../common/logger");
const { generateAccessToken } = require("../common/jwt");
const { fetchItemsByIds } = require("../common/utils");

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
  const { name, email, password, phone,  address } = req.body;

  try {
    const alreadyExists = await Customer.findOne({ email: email }).exec();
    if (alreadyExists) {
      res.status(409);
      throw Error("user already exists");
    }

    const hashedPassword = await bcrypt.hashu(password, 12);
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
    res.status(res.statusCode || 500);
    next(err);
  }
};

exports.getUserData = async (req, res, next) => {
  let customer;
  try {
    customer = await Customer.findById(req.params.userId);
    if (!customer) throw Error("user id not found");
  } catch (err) {
    logger.error(err);
    res.status(404).json({ message: err.message }).end();
    return;
  }
  res.json({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address || "",
    following: customer.follows.length,
  });
};

exports.getUserWishList = [
  async (req, res, next) => {
    let customer;
    try {
      customer = await Customer.findById(req.params.userId);
      if (!customer) throw Error("user id not found");
    } catch (err) {
      res.status(404);
      next(err);
      return;
    }
    req.wishlist = customer.wishlist;
    next();
  },
  fetchItemsByIds,
];

exports.addToWishlist = async (req, res, next) => {
  const { userId, productId } = req.params;
  let customer;
  let product;
  try {
    customer = await Customer.findById(userId);
    if (!customer) throw Error("customer not found");

    if (customer.wishlist.find((e) => e._id.toString() === productId)) {
      res.status(409);
      throw Error("the item is already in the wishlist");
    }

    product = await Product.findById(productId);
    if (!product) {
      product = await Meal.findById(productId);
      if (!product) throw Error("item id not found");
    }

    customer.wishlist.push(product._id);
    customer.save();
    res.status(200).json({ message: "success" });
  } catch (err) {
    if (!res.statusCode) res.status(404);
    next(err);
    return;
  }
};

exports.removeWishlist = async (req, res, next) => {
  const { userId, productId } = req.params;
  let customer;
  try {
    customer = await Customer.findById(userId);
    if (!customer) throw Error("customer not found");

    console.log(customer.wishlist);
    customer.wishlist = customer.wishlist.filter(
      (itemId) => itemId._id.toString() !== productId
    );
    customer.save();
    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(404);
    next(err);
  }
};
