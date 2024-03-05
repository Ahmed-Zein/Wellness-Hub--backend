const Seller = require("../seller/seller.model");
const Meal = require("./meal.model");

const logger = require("../common/logger");
const { transformMealToClientFormat } = require("../common/utils");

exports.getAllMeals = async (req, res, next) => {
  try {
    const meals = await Meal.find();
    const formattedMeals = meals.map(transformMealToClientFormat);
    res.status(200).json(formattedMeals);
  } catch (err) {
    res.status(500);
    next(Error("Internal server error"));
  }
};

exports.getMeal = async (req, res, next) => {
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

exports.addMeal = async (req, res, next) => {
  const seller = await Seller.findById(req.user);
  if (!seller) {
    res.status(403);
    next(Error("Unauthorized access: You are not a seller"));
  }
  if (req.body.seller !== seller._id.toString()) {
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
    seller.meals.push(meal._id);
    await seller.save();

    const newMeal = await meal.save();

    console.log(meal);
    res.status(201).json({
      ...transformMealToClientFormat(meal),
      message: "Meal added successfully",
    });
  } catch (err) {
    if (!res.statusCode) {
      res.status(400);
    }
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
    if (!res.statusCode) res.status(400);
    next(Error("Invalid data provided for updating meal"));
  }
};

const dummyImgs = [
  "https://eb8e7f6d53.nxcli.net/wp-content/uploads/2018/05/Untitled2.png",
  "https://www.emaratalyoum.com/polopoly_fs/1.1613899.1648092935!/image/image.jpg",
  "https://homechef.imgix.net/https%3A%2F%2Fasset.homechef.com%2Fuploads%2Fmeal%2Fplated%2F34178%2F821014.001.01SirloinSteakWithParsleyMustardButter_Ecomm_4_of_7_-02-07-23-082031.jpg?ixlib=rails-1.1.0&w=850&auto=format&s=da188132b36f42df1312a57e23a2bcee",
];
