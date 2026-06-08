const { trackGuestUsage: trackGuestUsageInDb } = require('../utils/guestUsage');

// Track usage for a guest
exports.trackUsage = async (req, res) => {
  try {
    const guestId = req.headers['x-guest-id'] || req.body.guestId || req.cookies?.guest_id;
    const feature = req.body.feature || 'unknown';

    if (!guestId) {
      return res.status(400).json({ error: 'Missing guestId' });
    }

    const usage = await trackGuestUsageInDb(guestId, feature);

    return res.json(usage);
  } catch (err) {
    console.error('Usage track error:', err);
    return res.status(500).json({ error: 'Could not track usage' });
  }
};
