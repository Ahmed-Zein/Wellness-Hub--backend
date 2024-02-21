const Meal = require("./meal.model");

exports.addReview = async (req, res) => {
  try {
    console.log(req.user);
    const meal = await Meal.findByIdAndUpdate(
      req.params.mealId,
      {
        $push: {
          reviews: { customer: req.user, content: req.body.content },
        },
      },
      { new: true }
    );
    res.status(201).json({ message: "success" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
