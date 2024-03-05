exports.transformMealToClientFormat = (meal) => {
  return {
    id: meal._id,
    seller: meal.seller,
    title: meal.title,
    images: meal.images,
    description: meal.description,
    tags: meal.tags,
    ingredients: [
      "Pizza dough",
      "Tomato sauce",
      "Fresh mozzarella cheese",
      "Fresh basil leaves",
      "Olive oil",
      "Salt and pepper to taste",
    ],
    rate: 3.4,
    price: meal.price,
    address: "cairo",
    reviews: meal.reviews.for,
  };
};
