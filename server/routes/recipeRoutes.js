const express = require("express");

const router = express.Router();

const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  deleteRecipe,
  searchRecipes,
} = require("../controller/recipeController");


// CREATE RECIPE
router.post("/", createRecipe);


// GET ALL RECIPES
router.get("/", getAllRecipes);


// SEARCH RECIPES
router.get("/search", searchRecipes);


// GET SINGLE RECIPE
router.get("/:id", getRecipeById);


// DELETE RECIPE
router.delete("/:id", deleteRecipe);


module.exports = router;