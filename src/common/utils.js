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
