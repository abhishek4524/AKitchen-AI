const express = require('express');
const router = express.Router();
const { getReviews, createReview } = require('../controller/reviewController');
const { protect } = require('../middleware/auth');

router.get('/', getReviews); // public
router.post('/', protect, createReview); // only logged-in users can post

module.exports = router;
