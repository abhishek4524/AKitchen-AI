const express = require('express');
const { analyzeFood, getHistory } = require('../controller/analyzeController');

const router = express.Router();

router.post('/analyze', analyzeFood);
router.get('/history', getHistory);
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

module.exports = router;