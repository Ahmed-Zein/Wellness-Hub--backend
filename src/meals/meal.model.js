const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categories = [
  "appetizers",
  "breakfastFoods",
  "desserts",
  "drinks",
  "mostlyMeat",
  "proteinShakes",
  "salads",
  "sandwiches",
  "pasta",
  "soups",
  "other",
  "mainDishes",
  "sideDishes",
];

const mealSchema = new Schema({
  seller: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  title: { type: String, required: true },
  images: [String],
  description: {
    type: String,
    required: true,
  },
  category: { type: String, enum: categories, required: true },
  price: { type: Number, float: true, required: true },
  ingredients: [String],
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
