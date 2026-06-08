const GuestUsage = require("../models/GuestUsage");

const ALLOWED_FEATURES = new Set(["ai_recipe", "nutrition_ai"]);

const normalizeFeature = (feature) => {
  if (typeof feature !== "string") return "unknown";
  const normalized = feature.trim().toLowerCase();
  return ALLOWED_FEATURES.has(normalized) ? normalized : "unknown";
};

/**
 * Track guest usage.
 * - Each guest gets exactly 1 free use per feature.
 * - If they've already used a feature once, `requiresLogin: true` is returned
 *   and the counter is NOT incremented again.
 */
const trackGuestUsage = async (guestId, feature) => {
  const normalizedFeature = normalizeFeature(feature);

  // First, read the current document (if it exists) without incrementing
  const existing = await GuestUsage.findOne({ guestId }).lean();

  // Determine current per-feature usage count
  const currentFeatureCount = existing?.features
    ? (existing.features[normalizedFeature] || 0)
    : 0;

  // If they've already used this feature at least once → block
  if (currentFeatureCount >= 1) {
    return {
      guestId,
      usageCount: existing?.usageCount || 1,
      feature: normalizedFeature,
      requiresLogin: true,
    };
  }

  // Otherwise allow and increment
  const update = {
    $inc: {
      usageCount: 1,
      [`features.${normalizedFeature}`]: 1,
    },
    $set: { lastUsed: new Date() },
  };

  const doc = await GuestUsage.findOneAndUpdate(
    { guestId },
    update,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  return {
    guestId: doc.guestId,
    usageCount: doc.usageCount || 1,
    feature: normalizedFeature,
    requiresLogin: false,
  };
};

module.exports = { trackGuestUsage, normalizeFeature };
