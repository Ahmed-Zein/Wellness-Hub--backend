const bcrypt = require("bcryptjs");

const { generateAccessToken } = require("../common/jwt");
const Logger = require("../common/logger");

exports.findOneUser = (UserType) => {
  return async (req, res, next) => {
    const { email } = req.body;
    try {
      const user = await UserType.findOne({ email: email })
        .select("email password _id")
        .exec();
      req.user = user;
      next();
    } catch (err) {
      Logger.error(err);
      res.status(404).json({ message: err.message }).end();
      return;
    }
  };
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!req.user) {
      Logger.error("email: " + email + " no exist");
      return res.status(401).send({ message: "email not exist" });
    }

    const isCorrectPassword = await bcrypt.compare(password, req.user.password);
    if (!isCorrectPassword) {
      Logger.error("wrong password");
      return res.status(401).send({ message: "wrong password" });
    }

    const accessToken = generateAccessToken(
      { _id: req.user._id },
      process.env.TOKEN_SECRET
    );

    if (!refreshToken) {
      refreshToken = generateAccessToken(
        { _id: req.user._id },
        process.env.TOKEN_SECRET,
        "30d"
      );
    }

    res.send({
      message: "success",
      userId: req.user._id,
      accessToken: accessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    next(err);
  }
};
