const bcrypt = require("bcryptjs");

const { generateAccessToken } = require("../common/jwt");

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
      res.status(500);
      next(err);
    }
  };
};

exports.login = async (req, res, next) => {
  const { password } = req.body;

  try {
    if (!req.user) {
      res.status(404);
      throw Error("email does not exist");
    }

    const isCorrectPassword = await bcrypt.compare(password, req.user.password);
    if (!isCorrectPassword) {
      res.status(401);
      throw Error("wrong password");
    }

    const accessToken = generateAccessToken(
      { _id: req.user._id },
      process.env.TOKEN_SECRET
    );

    res.send({
      message: "success",
      userId: req.user._id,
      accessToken: accessToken,
      refreshToken: accessToken,
    });
  } catch (err) {
    res.status(res.statusCode || 500);
    next(err);
  }
};
