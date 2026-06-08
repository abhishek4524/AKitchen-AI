const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ============================================================
// 1. REGISTER - Email/Password Signup
// ============================================================
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password, and name are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      passwordHash: password,
      name,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: error.message || "Registration failed" });
  }
};

// ============================================================
// 2. LOGIN - Email/Password Login
// ============================================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if user has a password (might be OAuth only)
    if (!user.hasPassword()) {
      return res.status(400).json({ 
        error: "This account uses social login. Please sign in with Google." 
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message || "Login failed" });
  }
};

// ============================================================
// 3. GET CURRENT USER - Protected Route
// ============================================================
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.toPublicJSON());
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch user" });
  }
};

// ============================================================
// 4. UPDATE PROFILE - Protected Route
// ============================================================
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, settings } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update allowed fields only
    if (name) user.name = name;
    if (settings) user.settings = { ...user.settings, ...settings };

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: user.toPublicJSON(),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: error.message || "Failed to update profile" });
  }
};

// ============================================================
// 5. CHANGE PASSWORD - Protected Route
// ============================================================
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new passwords are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Set new password
    user.passwordHash = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: error.message || "Failed to change password" });
  }
};

// ============================================================
// 6. REQUEST PASSWORD RESET
// ============================================================
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if email exists for security
      return res.json({
        message: "If email exists, reset link sent to inbox",
      });
    }

    // Generate reset token
    const resetToken = user.generatePasswordReset();
    await user.save();

    // TODO: Send email with reset link
    // const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    // await sendEmail(email, "Password Reset", resetUrl);

    res.json({
      message: "Password reset link sent to email",
      // In development, return token for testing (REMOVE IN PRODUCTION!)
      resetToken: process.env.NODE_ENV === "development" ? resetToken : undefined,
    });
  } catch (error) {
    console.error("Request password reset error:", error);
    res.status(500).json({ error: error.message || "Failed to process password reset" });
  }
};

// ============================================================
// 7. RESET PASSWORD
// ============================================================
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ error: "Reset token and new password are required" });
    }

    // Hash the token to compare with stored one
    const hashedToken = require("crypto")
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // Set new password
    user.passwordHash = newPassword;
    user.clearPasswordReset();
    await user.save();

    res.json({ message: "Password reset successfully. Please login with your new password." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: error.message || "Failed to reset password" });
  }
};

// ============================================================
// 8. ADD PASSWORD TO OAUTH USER
// ============================================================
exports.addPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user already has password
    if (user.hasPassword()) {
      return res.status(400).json({ error: "User already has a password" });
    }

    // Add password
    user.passwordHash = password;
    await user.save();

    res.json({
      message: "Password added successfully",
      user: user.toPublicJSON(),
    });
  } catch (error) {
    console.error("Add password error:", error);
    res.status(500).json({ error: error.message || "Failed to add password" });
  }
};
