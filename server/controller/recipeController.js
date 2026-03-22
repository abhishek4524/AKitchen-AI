const Recipe = require("../models/Recipe");

//CREATE RECIPE
exports.createRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get All Recipes
exports.getAllRecipes = async(req, res) => {
    try{
        const recipes = await Recipe.find().sort({ createdAt: -1 });
        res.json(recipes);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

//Get Single Recipe
exports.getRecipeById = async(req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.json(recipe);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};

//Delete Recipe
exports.deleteRecipe = async(req, res) => {
    try {
        await Recipe.findByIdAndDelete(req.params.id);
        res.json({ message: "Recipe deleted" });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

//Search Recipes
exports.searchRecipes = async(req, res) => {
    try {
        const { query } = req.query.q;

        const recipes = await Recipe.find({
            title: { $regex: query, $options: "i" },
        });
        res.json(recipes);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
};