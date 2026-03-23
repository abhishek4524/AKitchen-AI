const User = require("../models/User");
const Recipe = require("../models/Recipe");

// Save a recipe
exports.saveRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicate saves
    if (user.savedRecipes.includes(recipeId)) {
      return res.status(400).json({ message: "Recipe already saved" });
    }

    user.savedRecipes.push(recipeId);
    await user.save();

    res.status(200).json({ message: "Recipe saved", savedRecipes: user.savedRecipes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user profile with saved recipes populated
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("savedRecipes")
      .select("-password");

    const createdRecipes = await Recipe.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    const aiRecipes = createdRecipes.filter((r) => r.aiGenerated);

    res.json({
      ...user.toObject(),
      createdRecipes,
      recipesCount: createdRecipes.length,
      aiRecipesCount: aiRecipes.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};