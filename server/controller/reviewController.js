const Review = require('../models/Review');

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ message: 'Cannot load reviews' });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { name, rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    const review = await Review.create({
      user: req.user ? req.user._id : undefined,
      name: name || (req.user?.name || 'Anonymous'),
      rating,
      comment,
    });

    return res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({ message: 'Could not submit review' });
  }
};
