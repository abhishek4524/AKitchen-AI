const express = require('express');
const router = express.Router();
// Import both controllers
const usageController = require('../controller/usageController');
const apiUsageController = require('../controller/apiUsageController');

// GET /api/usage/stats - retrieve aggregated API usage for current user
router.get('/stats', apiUsageController.getUserApiUsage);

// POST /api/usage/track - track guest usage
router.post('/track', usageController.trackUsage);

module.exports = router;
