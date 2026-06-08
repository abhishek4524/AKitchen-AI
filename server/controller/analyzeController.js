const Analysis = require('../models/Analysis');
const { fetchNutritionData } = require('../services/nutritionService');
const getRecipeImage = require('../services/imageService');
const {
  calculateHealthScore,
  generatePoints,
  determineCategory,
  generateSummary
} = require('../utils/healthCalculator');

// Normalize food name for caching
const normalizeName = (name) => name.toLowerCase().trim().replace(/[^\w\s]/g, '');

/**
 * Main analysis endpoint
 */
const analyzeFood = async (req, res) => {
  try {
    let { foodName } = req.body;
    
    if (!foodName || typeof foodName !== 'string') {
      return res.status(400).json({ error: 'Food name is required' });
    }

    foodName = foodName.trim();
    const normalized = normalizeName(foodName);

    // Check cache in MongoDB (last 30 days)
    const cachedAnalysis = await Analysis.findOne({ normalizedName: normalized });
    if (cachedAnalysis) {
      console.log(`Cache hit for: ${foodName}`);
      return res.json({
        name: cachedAnalysis.foodName,
        category: cachedAnalysis.category,
        healthScore: cachedAnalysis.healthScore,
        summary: cachedAnalysis.summary,
        badPoints: cachedAnalysis.badPoints,
        goodPoints: cachedAnalysis.goodPoints,
        unhealthyIngredients: cachedAnalysis.unhealthyIngredients,
        healthyIngredients: cachedAnalysis.healthyIngredients,
        imageUrl: cachedAnalysis.imageUrl
      });
    }

    // Fetch from external API
    const { nutrition, ingredients } = await fetchNutritionData(
      foodName,
      process.env.USDA_API_KEY,
      req
    );

    // Calculate health metrics
    const healthScore = calculateHealthScore(nutrition);
    const { goodPoints, badPoints, healthyIngredients, unhealthyIngredients } = 
      generatePoints(nutrition, foodName);
    const category = determineCategory(foodName, nutrition);
    const summary = generateSummary(healthScore, nutrition, foodName);
    const imageUrl = await getRecipeImage(foodName, req) || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80";

    // Save to MongoDB for caching
    const analysisDoc = new Analysis({
      foodName,
      normalizedName: normalized,
      category,
      healthScore,
      summary,
      badPoints,
      goodPoints,
      unhealthyIngredients,
      healthyIngredients,
      imageUrl,
      nutritionData: nutrition
    });
    await analysisDoc.save();

    // Return response
    res.json({
      name: foodName,
      category,
      healthScore,
      summary,
      badPoints,
      goodPoints,
      unhealthyIngredients,
      healthyIngredients,
      imageUrl
    });
  } catch (error) {
    console.error('Analysis error:', error.message);
    res.status(500).json({ 
      error: 'Unable to analyze food. Please try a different food name.',
      details: error.message 
    });
  }
};

/**
 * Get recent analyses history
 */
const getHistory = async (req, res) => {
  try {
    const history = await Analysis.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select('foodName healthScore category createdAt');
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

module.exports = { analyzeFood, getHistory };