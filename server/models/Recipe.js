const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: String,

  description: String,

  ingredients: [
    {
      name: String,
      quantity: String,
    },
  ],

  steps: [String],

  cuisine: String,

  diet: String,

  time: String,

  difficulty: String,

  image: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  aiGenerated: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
