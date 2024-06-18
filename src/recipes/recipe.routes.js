const express = require("express");
const router = express.Router();
const Recipe = require("./recipe.model"); // Adjust the path if necessary
const { authenticateToken } = require("../common/jwt"); // Import the authenticate token middleware

// GET /recipes: Get a list of all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
    console.log("Get request successful");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /recipes/:recipeId: Get details of a specific recipe
router.get("/:recipeId", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /recipes: Create a new recipe  ---> enta 3amelha ay 7d y2dr y3ml recipie mesh lazm Customer l2n ana mesh 3arf dh mafrod chef wla seller wla customer el b share recipies 
router.post("/", authenticateToken, async (req, res) => {
  try {
    console.log("Creating a new recipe...");

    const newRecipe = new Recipe({
      owner: req.user, // Assuming req.user contains the user's ID
      title: req.body.title,
      description: req.body.description,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      calories: req.body.calories,
      protein: req.body.protein,
      fats: req.body.fats,
      carbohydrates: req.body.carbohydrates,
      images: req.body.images,
      tags: req.body.tags,
    });

    console.log(newRecipe);

    await newRecipe.save();
    res.status(201).json({ message: "Recipe created successfully", recipe: newRecipe });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
