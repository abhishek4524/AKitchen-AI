const Recipe = require("../models/Recipe");
const generateRecipeAI = require("../services/aiService");
const getRecipeImage = require("../services/imageService");

exports.generateRecipe = async (req, res) => {
  try {
    const { ingredients, cuisine, diet } = req.body;

    const aiRecipe = await generateRecipeAI(
      ingredients,
      cuisine,
      diet
    );

    // 🖼️ Fetch image
    const image = await getRecipeImage(aiRecipe.imageQuery || aiRecipe.title);

    // Save in DB
    const recipe = await Recipe.create({
      ...aiRecipe,
      cuisine,
      diet,
      image,
      aiGenerated: true,
    });

    res.json(recipe);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "AI generation failed" });
  }
};