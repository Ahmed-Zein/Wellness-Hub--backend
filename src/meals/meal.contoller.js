const Meal = require("./meal.model");
const logger = require("../common/logger");
const { transformMealToClientFormat } = require("../common/utils");

exports.getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find();
    const formattedMeals = meals.map(transformMealToClientFormat);
    res.status(200).json(formattedMeals);
  } catch (err) {
    res.status(500);
    next(Error("Internal server error"));
  }
};

exports.getMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.mealId);
    if (!meal) {
      res.status(404).json({ message: "Meal not found" });
    }
    res.json(transformMealToClientFormat(meal));
  } catch (err) {
    res.status(500);
    next(Error("Internal server error"));
  }
};

exports.addMeal = async (req, res) => {

  if (req.body.seller !== req.user) {
    logger.error("Seller id does not match current user id");
    res.status(403).json({
      message: "Unauthorized access: You are not the seller of this meal",
    });
    return;
  }

  const meal = new Meal({
    seller: req.user,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    tags: req.body.tags,
    images: dummyImgs,
  });

  try {
    const newMeal = await meal.save();
    res.status(201).json({
      ...transformMealToClientFormat(newMeal),
      message: "Meal added successfully",
    });
  } catch (err) {
    res.status(400);
    next(Error("Invalid data provided for adding meal"));
  }
};

exports.deleteOneMeal = async (req, res) => {
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
      res.status(404).json({ message: "Meal not found" });
      return;
    }
    if (req.user !== meal.seller.toString()) {
      res.status(403).json({
        message: "Unauthorized access: You are not the seller of this meal",
      });
      return;
    }

    meal.title = req.body.title || meal.title;
    meal.description = req.body.description || meal.description;
    meal.price = req.body.price || meal.price;
    meal.tags = req.body.tags || meal.tags;
    meal.images = req.body.images || meal.images;

    const updatedMeal = await meal.save();

    res.json({
      message: "Meal updated successfully",
      id: updatedMeal._id,
    });
  } catch (err) {
    res.status(400);
    next(Error("Invalid data provided for updating meal"));
  }
};

const dummyImgs = [
  "https://www.middleeasteye.net/news/sisis-breakfast-simple-family-outrages-egyptians",
  "https://www.emaratalyoum.com/politics/news/2022-03-24-1.1613898",
  "https://www.reddit.com/r/memes/comments/f27raq/beat_the_living_shit_out_of_it/",
  "https://eb8e7f6d53.nxcli.net/wp-content/uploads/2018/05/Untitled2.png",
];
