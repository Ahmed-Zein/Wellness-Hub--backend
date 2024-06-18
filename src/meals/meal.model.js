const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categories = {
  appetizers: "appetizers",
  breakfastFoods: "breakfastFoods",
  desserts: "desserts",
  drinks: "drinks",
  mostlyMeat: "mostlyMeat",
  proteinShakes: "proteinShakes",
  salads: "salads",
  sandwiches: "sandwiches",
  pasta: "pasta",
  soups: "soups",
  other: "other",
  mainDishes: "mainDishes",
  sideDishes: "sideDishes",
};

const mealSchema = new Schema({
  seller: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  title: { type: String, required: true },
  images: [String],
  description: {
    type: String,
    required: true,
  },
  type: { type: String, enum: categories, required: true },
  price: { type: Number, float: true, required: true },
  tags: [String],
  reviews: [
    {
      customer: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Meal", mealSchema);
