const ApiUsage = require('../models/ApiUsage');

/**
 * Middleware to track usage of a specific API key.
 * @param {string} apiKeyName - Identifier for the API (e.g., 'USDA_API_KEY').
 */
const trackApiUsage = async (apiKeyName, req) => {
  try {
    // Determine user identifier. Prefer authenticated user, otherwise fallback to guest header.
    const userId = req.user?.id || req.headers['x-guest-id'] || null;
    if (!userId) return; // anonymous usage not tracked
    await ApiUsage.findOneAndUpdate(
      { userId, apiKeyName },
      { $inc: { count: 1 }, $set: { lastUsed: new Date() } },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error('API usage tracking error:', err);
  }
};

module.exports = trackApiUsage;
