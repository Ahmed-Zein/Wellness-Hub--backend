require("dotenv").config();

const config = {
  PORT: 3000,
  MONGO_URI: process.env.MONGO_URI,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  STRIPE_PRIVATE_KEY: process.env.STRIPE_PRIVATE_KEY,
};

module.exports = config;
