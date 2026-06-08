const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: true,
    trim: true
  },
  normalizedName: {
    type: String,
    required: true,
    index: true
  },
  category: String,
  healthScore: {
    type: Number,
    min: 0,
    max: 100
  },
  summary: String,
  badPoints: [String],
  goodPoints: [String],
  unhealthyIngredients: [String],
  healthyIngredients: [String],
  imageUrl: String,
  nutritionData: {
    calories: Number,
    totalFat: Number,
    saturatedFat: Number,
    cholesterol: Number,
    sodium: Number,
    totalCarbohydrate: Number,
    dietaryFiber: Number,
    sugars: Number,
    protein: Number
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // Auto-delete after 30 days (cache TTL)
  }
});

module.exports = mongoose.model('Analysis', analysisSchema);