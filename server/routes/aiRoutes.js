const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth")

const { generateRecipe } = require("../controller/aiController");

router.post("/generate-recipe",protect, generateRecipe);

module.exports = router;