const express = require("express");
const router = express.Router();
const { generateRecipe } = require("../controller/aiController");

// Allow optional guest usage; controller enforces usage limits
router.post("/generate-recipe", generateRecipe);

module.exports = router;