const mongoose = require('mongoose');

const recipeViewSchema = new mongoose.Schema({
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  viewedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RecipeView', recipeViewSchema);
