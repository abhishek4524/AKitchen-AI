const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true, default: "Other" },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // make it required so we never forget
    },
    price: { type: Number, required: true, default: 20 },
    done: { type: Boolean, default: false },
    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Item", itemSchema);