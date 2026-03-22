const express = require('express');
const { getSuggestions } = require('../controller/suggestionController');
const router = express.Router();

router.get('/suggestions', getSuggestions);

module.exports = router;