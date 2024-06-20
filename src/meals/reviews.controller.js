const CustomError = require("../errors/customerError");
const { NotFoundError } = require("../errors/error-types");
const Meal = require("./meal.model");

exports.addReview = async (req, res, next) => {
  try {
    const meal = await Meal.findByIdAndUpdate(
      req.params.mealId,
      {
        $push: {
          reviews: { customer: req.user, content: req.body.content },
        },
      },
      { new: true }
    );
    if (!meal) {
      throw new CustomError("Meal not found", NotFoundError, 404);
    }
    res.status(201).json({ message: "success", reviews: [...meal.reviews] });
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  const { mealId, reviewId } = req.params;
  try {
    const meal = await Meal.findByIdAndUpdate(
      mealId,
      {
        $pull: {
          reviews: { _id: reviewId },
        },
      },
      { new: true }
    );

    if (!meal) {
      throw new CustomError("Meal not found", NotFoundError, 404);
    }
    res.status(201).json({ message: "success" });
  } catch (err) {
    next(err);
  }
};

exports.updateReview = async (req, res, next) => {
  const { mealId, reviewId } = req.params;
  try {
    const meal = await Meal.findOneAndUpdate(
      { _id: mealId, "reviews._id": reviewId },
      {
        $set: {
          "reviews.$.content": req.body.content,
          "reviews.$.updatedAt": new Date(),
        },
      },
      { new: true }
    );
    if (!meal) {
      throw new CustomError("Meal not found", NotFoundError, 404);
    }
    res.status(201).json({ message: "success", reviews: [...meal.reviews] });
  } catch (err) {
    next(err);
  }
};
