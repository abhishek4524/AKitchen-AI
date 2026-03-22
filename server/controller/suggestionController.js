const Item = require('../models/Item');

exports.getSuggestions = async (req, res) => {
  try {
    // Aggregate items to count frequency of each name
    const suggestions = await Item.aggregate([
      { $group: { _id: '$name', count: { $sum: 1 }, category: { $first: '$category' }, price: { $first: '$price' }, image: { $first: '$image' } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { name: '$_id', category: 1, price: 1, image: 1, _id: 0 } }
    ]);
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};