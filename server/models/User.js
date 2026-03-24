const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  googleId: String,
  name: String,

  email: {
    type: String,
    unique: true,
    required: true,
  },

  // ✅ ADD THIS (IMPORTANT)
  password: {
    type: String,
    default: null, // Google users ke liye safe
  },

  picture: String,

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  plan: {
    type: String,
    default: "free",
  },

  settings: {
    theme: {
      type: String,
      default: "light",
    },
    notifications: {
      type: Boolean,
      default: true,
    },
  },

  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});


// 🔐 AUTO HASH PASSWORD
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// 🔐 PASSWORD COMPARE
UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);