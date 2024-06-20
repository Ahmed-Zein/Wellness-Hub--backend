const Seller = require("../seller/seller.model");
const Meal = require("./meal.model");

const logger = require("../common/logger");
const { transformMealToClientFormat } = require("../common/utils");
const CustomError = require("../errors/customerError");
const { NotFoundError, UnAuthorizedAccess } = require("../errors/error-types");

exports.getAllMeals = async (req, res, next) => {
  try {
    const meals = await Meal.find().sort({ createdAt: -1 });
    const formattedMeals = meals.map(transformMealToClientFormat);
    res.status(200).json(formattedMeals);
  } catch (err) {
    next(err);
  }
};

exports.getMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.mealId);
    if (!meal) {
      throw new CustomError("meal not found", NotFoundError, 404);
    }
    res.json(transformMealToClientFormat(meal));
  } catch (err) {
    next(err);
  }
};

exports.addMeal = async (req, res, next) => {
  try {
    const seller = await Seller.findById(req.user);

    if (!seller) {
      throw new CustomError("you are not a seller", UnAuthorizedAccess, 403);
    }

    if (req.body.seller !== seller._id.toString()) {
      throw new CustomError(
        "seller id in the body does not match the seller in the auth token",
        UnAuthorizedAccess,
        403
      );
    }

    const meal = new Meal(req.body);

    seller.meals.push(meal._id);

    await Promise.all([seller.save(), meal.save()]);

    res.status(201).json({
      ...transformMealToClientFormat(meal),
      message: "Meal added successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteOneMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.mealId);
    if (!meal) {
      res.status(404).json({ message: "Meal not found" });
      return;
    }
    if (meal.seller.toString() !== req.user.toString()) {
      res.status(403).json({
        message: "Unauthorized access: You are not the seller of this meal",
      });
      return;
    }
    await meal.deleteOne({ _id: req.params.mealId });
    res.json({ message: "Meal deleted successfully" });
  } catch (err) {
    res.status(500);
    next(Error("Internal server error"));
  }
};

exports.updateMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.mealId);
    if (!meal) {
      throw new CustomError("Meal not found", NotFoundError, 404);
    }
    if (req.user !== meal.seller.toString()) {
      throw new CustomError(
        "You are not the seller of this meal",
        UnAuthorizedAccess,
        403
      );
    }

    meal.title = req.body.title || meal.title;
    meal.description = req.body.description || meal.description;
    meal.price = req.body.price || meal.price;
    meal.images = req.body.images || meal.images;

    const updatedMeal = await meal.save();

    res.json({
      message: "Meal updated successfully",
      id: updatedMeal._id,
    });
  } catch (err) {
    next(err);
  }
};
