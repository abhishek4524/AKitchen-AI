const express = require("express");
const router = express.Router();

const { generateRecipe } = require("../controller/aiController");

router.post("/generate-recipe", generateRecipe);

module.exports = router;