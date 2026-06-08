const Recipe = require("../models/Recipe");
const generateRecipeAI = require("../services/aiService");
const getRecipeImage = require("../services/imageService");
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { trackGuestUsage } = require('../utils/guestUsage');

const getUserFromToken = async (req) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.split(' ')[1];
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (!decoded?.id) return null;
    const user = await User.findById(decoded.id);
    return user || null;
  } catch (err) {
    return null;
  }
};

exports.generateRecipe = async (req, res) => {
  try {
    const { ingredients, cuisine, diet } = req.body;

    // Try to resolve an authenticated user from Bearer token (optional)
    const user = await getUserFromToken(req);

    // For guests, require guestId and enforce limit
    if (!user) {
      const guestId = req.headers['x-guest-id'] || req.cookies?.guest_id || req.body.guestId;
      if (!guestId) {
        return res.status(400).json({ error: 'Missing guest id' });
      }

      const usage = await trackGuestUsage(guestId, 'ai_recipe');

      if (usage.requiresLogin) {
        return res.status(403).json(usage);
      }
    }

    const aiRecipe = await generateRecipeAI(
      ingredients,
      cuisine,
      diet
    );

    // 🖼️ Fetch image
    const image = await getRecipeImage(aiRecipe.imageQuery || aiRecipe.title);

    // Save in DB (if a user exists, attach createdBy; otherwise save without creator)
    const recipeData = {
      ...aiRecipe,
      cuisine,
      diet,
      image,
      aiGenerated: true,
    };
    if (user) recipeData.createdBy = user._id;

    const recipe = await Recipe.create(recipeData);

    // If user exists, append to createdRecipes
    if (user && user.createdRecipes) {
      user.createdRecipes.push(recipe._id);
      await user.save();
    }

    res.json(recipe);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "AI generation failed" });
  }
};
