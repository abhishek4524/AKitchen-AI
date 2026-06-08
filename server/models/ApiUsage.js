const mongoose = require('mongoose');

const apiUsageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  apiKeyName: { type: String, required: true }, // e.g. 'USDA_API_KEY'
  count: { type: Number, default: 0 },
  lastUsed: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('ApiUsage', apiUsageSchema);
