const axios = require('axios');
const trackApiUsage = require('../utils/trackApiUsage');

// USDA FoodData Central API endpoint for food search
const USDA_SEARCH_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search';
// USDA endpoint for detailed food information (optional, using search result which contains nutrients)
// const USDA_DETAILS_URL = 'https://api.nal.usda.gov/fdc/v1/food';

/**
 * Map USDA nutrient IDs to our desired nutrient keys.
 * Reference: https://fdc.nal.usda.gov/api-key-help.html
 */
const NUTRIENT_MAP = {
  1008: 'calories',            // Energy (kcal)
  1004: 'totalFat',            // Total lipid (fat)
  1005: 'saturatedFat',        // Fatty acids, total saturated
  1258: 'cholesterol',         // Cholesterol
  1093: 'sodium',              // Sodium, Na
  1009: 'totalCarbohydrate',   // Carbohydrate, by difference
  1079: 'dietaryFiber',        // Fiber, total dietary
  2000: 'sugars',              // Sugars, total including added sugars
  1003: 'protein'              // Protein
};

/**
 * Fetch nutritional data from USDA FoodData Central API.
 * Returns an object with `nutrition` (mapped nutrients) and `ingredients` (food name split).
 */
const fetchNutritionData = async (foodName, apiKey, req) => {
  try {
    // Search for the food name
    // Track usage
    await trackApiUsage('USDA_API_KEY', req);
    const searchResponse = await axios.get(USDA_SEARCH_URL, {
      params: {
        api_key: apiKey,
        query: foodName,
        // We request only the first page with 1 result to keep it simple
        pageSize: 1
      }
    });

    const foods = searchResponse.data.foods;
    if (!foods || foods.length === 0) {
      throw new Error('No food found in USDA database');
    }

    const food = foods[0];
    // USDA returns an array of nutrients with id and amount.
    const nutrientsArray = food.foodNutrients || [];
    const nutrition = {};
    for (const nuc of nutrientsArray) {
      const key = NUTRIENT_MAP[nuc.nutrientId];
      if (key) {
        nutrition[key] = nuc.amount || 0;
      }
    }

    // Ensure all expected keys exist (default to 0)
    for (const key of Object.values(NUTRIENT_MAP)) {
      if (!(key in nutrition)) nutrition[key] = 0;
    }

    // Ingredients: we can approximate using the description field
    const ingredients = food.description ? food.description.split(' ') : [foodName];

    return { nutrition, ingredients: Array.isArray(ingredients) ? ingredients : [ingredients] };
  } catch (error) {
    console.error('USDA API error:', error.response?.data || error.message);
    throw new Error('Failed to fetch nutritional data from USDA');
  }
};

module.exports = { fetchNutritionData };