const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// User Schema
const userSchema = new mongoose.Schema(
  {
    // Email & Password Auth
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      default: null,
    },
    // Legacy admin setup used `password`; keep it hidden and migrate it to
    // `passwordHash` on save so old scripts do not create unusable accounts.
    password: {
      type: String,
      default: undefined,
      select: false,
    },

    // Google OAuth
    googleId: {
      type: String,
      default: null,
    },

    // User Profile
    name: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

    // Password Reset
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordTokenExpiry: {
      type: Date,
      default: null,
    },

    // Email Verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationTokenExpiry: {
      type: Date,
      default: null,
    },

    // App Features
    savedRecipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    createdRecipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],

    // Settings
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

    // Usage tracking (counts of AI feature usage tied to authenticated user)
    usageCount: {
      type: Number,
      default: 0,
    },

    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, collection: "users" }
);

// ============================================================
// MIDDLEWARE - Hash password before saving
// ============================================================
userSchema.pre("save", async function () {
  if (this.isModified("password") && this.password) {
    this.passwordHash = this.password;
    this.password = undefined;
  }

  if (!this.isModified("passwordHash")) {
    return;
  }

  try {
    if (!this.passwordHash || this.passwordHash.startsWith("$2")) {
      return;
    }
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  } catch (error) {
    throw error;
  }
});

// ============================================================
// METHODS - Compare password
// ============================================================
userSchema.methods.comparePassword = async function (plainPassword) {
  if (this.passwordHash) {
    return await bcrypt.compare(plainPassword, this.passwordHash);
  }

  if (!this.password) {
    return false;
  }

  if (this.password.startsWith("$2")) {
    return await bcrypt.compare(plainPassword, this.password);
  }

  return plainPassword === this.password;
};

// ============================================================
// METHODS - Check if user has password
// ============================================================
userSchema.methods.hasPassword = function () {
  return !!this.passwordHash || !!this.password;
};

// ============================================================
// METHODS - Check admin access
// ============================================================
userSchema.methods.isAdminUser = function () {
  return this.role === "admin" || this.isAdmin === true;
};

// ============================================================
// METHODS - Generate password reset token
// ============================================================
userSchema.methods.generatePasswordReset = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  this.resetPasswordTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
  return token;
};

// ============================================================
// METHODS - Verify password reset token
// ============================================================
userSchema.methods.isPasswordResetTokenValid = function () {
  return this.resetPasswordTokenExpiry > new Date();
};

// ============================================================
// METHODS - Clear password reset token
// ============================================================
userSchema.methods.clearPasswordReset = function () {
  this.resetPasswordToken = null;
  this.resetPasswordTokenExpiry = null;
};

// ============================================================
// METHODS - Generate email verification token
// ============================================================
userSchema.methods.generateEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.emailVerificationToken = crypto.createHash("sha256").update(token).digest("hex");
  this.emailVerificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return token;
};

// ============================================================
// METHODS - Verify email token
// ============================================================
userSchema.methods.isEmailVerificationTokenValid = function () {
  return this.emailVerificationTokenExpiry > new Date();
};

// ============================================================
// METHODS - Verify email
// ============================================================
userSchema.methods.verifyEmail = function () {
  this.isEmailVerified = true;
  this.emailVerificationToken = null;
  this.emailVerificationTokenExpiry = null;
};

// ============================================================
// METHODS - Return public JSON (no sensitive data)
// ============================================================
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    email: this.email,
    name: this.name,
    picture: this.picture,
    role: this.role,
    isAdmin: this.isAdmin,
    isEmailVerified: this.isEmailVerified,
    settings: this.settings,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
