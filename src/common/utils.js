const Meal = require("../meals/meal.model");
const Product = require("../product/product.model");

exports.transformMealToClientFormat = (meal) => {
  return {
    id: meal._id,
    seller: meal.seller,
    title: meal.title,
    address: "cairo",
    description: meal.description,
    tags: meal.tags,
    images: meal.images,
    ingredients: [
      "Pizza dough",
      "Tomato sauce",
      "Fresh mozzarella cheese",
      "Fresh basil leaves",
      "Olive oil",
      "Salt and pepper to taste",
    ],
    reviews: meal.reviews,
    rate: 3.4,
    price: meal.price,
  };
};

exports.fetchItemsByIds = async (req, res, next) => {
  try {
    const itemIds = req.wishlist;

    const itemsData = [];

    for (const itemId of itemIds) {
      let itemData;

      const product = await Product.findById(itemId);
      if (product) {
        itemData = {
          type: "product",
          ...product,
        };
      } else {
        const meal = await Meal.findById(itemId);
        if (meal) {
          itemData = {
            type: "meal",
            ...this.transformMealToClientFormat(meal),
          };
        }
      }
      if (itemData) {
        itemsData.push(itemData);
      }
    }
    return res.status(200).json({ message: "success", whishlist: itemsData });
  } catch (err) {
    res.status(500);
    next(err);
  }
};
