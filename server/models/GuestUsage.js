const mongoose = require('mongoose');

const guestUsageSchema = new mongoose.Schema(
  {
    guestId: { type: String, required: true, unique: true },
    usageCount: { type: Number, default: 0 },
    lastUsed: { type: Date, default: Date.now },
    features: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GuestUsage', guestUsageSchema);
