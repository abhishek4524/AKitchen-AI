const ApiUsage = require('../models/ApiUsage');

/**
 * Get aggregated API usage statistics for the authenticated user.
 * Returns an array of objects: { apiKeyName, count, lastUsed }
 */
const getUserApiUsage = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const usage = await ApiUsage.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$apiKeyName',
          count: { $sum: '$count' },
          lastUsed: { $max: '$lastUsed' },
        },
      },
      {
        $project: {
          _id: 0,
          apiKeyName: '$_id',
          count: 1,
          lastUsed: 1,
        },
      },
    ]);
    res.json(usage);
  } catch (err) {
    console.error('Error fetching API usage:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserApiUsage };
