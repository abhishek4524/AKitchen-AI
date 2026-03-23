const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔐 Login attempt:", { email, passwordLength: password?.length });

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find user
    const user = await User.findOne({ email });
    console.log("👤 User found:", user ? "Yes" : "No");

    if (!user) {
      console.log("❌ User not found in database");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("🔍 User details:", { isAdmin: user.isAdmin, hasPassword: !!user.password });

    // Check password with bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if user is admin
    if (!user.isAdmin) {
      console.log("❌ User is not admin");
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    // Generate token
    const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: true },
      jwtSecret,
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful for:", email);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Get All Users (for admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("savedRecipes")
      .populate("createdRecipes");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
