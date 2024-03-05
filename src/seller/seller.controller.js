const bcrypt = require("bcryptjs");

const Seller = require("./seller.model");
const logger = require("../common/logger");
const { generateAccessToken } = require("../common/jwt");

exports.register = async (req, res) => {
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

    await seller.save();
    const accessToken = generateAccessToken(
      { _id: seller._id },
      process.env.TOKEN_SECRET
    );

    logger.info("seller registerd successfully");
    res.status(201).send({
      message: "seller registerd successfully",
      userId: result._id,
      token: accessToken,
    });
  } catch (e) {
    logger.error(e);
    res.status(500).send({ error: e.message });
  }
};

exports.getSellerData = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.sellerId);
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
    res.status(400).json({ error: error.message, seller: req.params.sellerId });
  }
};
