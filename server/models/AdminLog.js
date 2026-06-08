const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  adminName: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true // e.g., 'DELETE_USER', 'CHANGE_ROLE', 'DELETE_RECIPE'
  },
  resource: {
    type: String,
    required: true // e.g., 'User', 'Recipe', 'Setting'
  },
  resourceId: {
    type: String,
    required: false
  },
  details: {
    type: Object,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("AdminLog", adminLogSchema);
