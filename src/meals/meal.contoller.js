const Meal = require("./meal.model");

exports.getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find();
    const formattedMeals = meals.map((meal) => formatMeal(meal));
    console.log(formattedMeals);
    res.status(200).json(formattedMeals);
  } catch (err) {
    res.status(500);
    next(new Error("Internal server Error"));
  }
};

exports.getMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.mealId);
    if (meal) {
      console.log(meal);
      res.json(formatMeal(meal));
    } else {
      res.status(404).json({ message: "Meal not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMeal = async (req, res) => {
  if (req.body.seller != req.user) {
    res.status(403).json({
      message: "seller id does not match current user idot your Meal",
    });
    return;
  }

  const meal = new Meal({
    seller: req.body.seller,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    tags: req.body.tags,
    images: dummyImgs,
  });

  try {
    const newMeal = await meal.save();
    res.status(201).json({ ...formatMeal(newMeal), message: "success" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteOneMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.mealId);
    if (!meal) {
      res.status(404).json({ message: "Meal not found" }).end();
      return;
    }
    if (meal.seller.toString() === req.user.toString()) {
      await meal.deleteOne({ _id: req.params.mealId });
      res.json({ message: "Meal deleted" }).end();
    } else {
      res.status(403).json({
        message: "seller id does not match current user idot your Meal",
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.mealId);
    if (!meal) {
      res.status(404).json({ message: "Meal not found" });
      return;
    }
    if (req.user != meal.seller) {
      res.status(403).json({
        message: "seller id does not match current userId of the Meal",
      });
      return;
    }
    meal.title = req.body.title || meal.title;
    meal.description = req.body.description || meal.description;
    meal.price = req.body.price || meal.price;
    meal.tags = req.body.tags || meal.tags;
    meal.images = req.body.images || meal.images;

    const updatedMeal = await meal.save();
    res.json(formatMeal({ message: "success", ...formatMeal(updatedMeal) }));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


function formatMeal(meal) {
  return {
    id: meal._id,
    seller: meal.seller,
    title: meal.title,
    images: meal.images,
    description: meal.description,
    tags: meal.tags,
    reviews: meal.reviews.for,
  };
}
const dummyImgs = [
  "https://www.middleeasteye.net/news/sisis-breakfast-simple-family-outrages-egyptians",
  "https://www.emaratalyoum.com/politics/news/2022-03-24-1.1613898",
  "https://www.reddit.com/r/memes/comments/f27raq/beat_the_living_shit_out_of_it/",
  "https://eb8e7f6d53.nxcli.net/wp-content/uploads/2018/05/Untitled2.png",
];
