const bcrypt = require("bcryptjs");

const Seller = require("./seller.model");
const logger = require("../common/logger");
const { generateAccessToken } = require("../common/jwt");
const CustomError = require("../errors/customerError");
const {
  AuthError,
  UnprocessableEntity,
  ServerError,
  NotFoundError,
} = require("../errors/error-types");

exports.register = async (req, res, next) => {
  const { name, email, password, SSN, phone, address } = req.body;

  try {
    if (!(name && email && password && phone))
      throw new CustomError("missing data", UnprocessableEntity, 422);

    const alreadyExists = await Seller.findOne({ email: email }).exec();
    if (alreadyExists) {
      throw new CustomError("seller already exists", AuthError, 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    if (!hashedPassword)
      throw new CustomError("Something went wrong", ServerError, 500);
    const seller = await Seller.create({
      name: name,
      email: email,
      password: hashedPassword,
      SSN: SSN,
      phone: phone,
      address: address,
    });

    await seller.save();
    const accessToken = generateAccessToken({ _id: seller._id });

    res.status(201).send({
      message: "success",
      userId: seller._id,
      token: accessToken,
    });
  } catch (err) {
    next(err);
  }
};

exports.getSellerData = async (req, res, next) => {
  try {
    const seller = await Seller.findById(req.params.sellerId);
    if (!seller) {
      throw new CustomError("Seller not found", NotFoundError, 404);
    }
    res.status(200).json({
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      meals: seller.meals,
      products: seller.products,
    });
  } catch (err) {
    next(err);
  }
};
