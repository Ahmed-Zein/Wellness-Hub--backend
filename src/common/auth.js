const bcrypt = require("bcryptjs");

const { generateAccessToken } = require("../common/jwt");
const CustomError = require("../errors/customerError");
const { AuthError, UnAuthorizedAccess } = require("../errors/error-types");

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
      throw new CustomError("email does not exist", AuthError, 404);
    }

    const isCorrectPassword = await bcrypt.compare(password, req.user.password);
    if (!isCorrectPassword) {
      throw new CustomError("wrong password", UnAuthorizedAccess, 401);
    }

    const accessToken = generateAccessToken({ _id: req.user._id });

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
