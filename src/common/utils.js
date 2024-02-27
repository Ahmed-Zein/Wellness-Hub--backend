exports.ping = (req, res) => {
  res.status(200).end();
};
exports.formatMeal = (meal) => {
  return {
    id: meal._id,
    seller: meal.seller,
    title: meal.title,
    images: meal.images,
    description: meal.description,
    tags: meal.tags,
    reviews: meal.reviews.for,
  };
};
