const User = require("../models/User");
const GuestUsage = require("../models/GuestUsage");
const Recipe = require("../models/Recipe");
const Review = require("../models/Review");
const AdminLog = require("../models/AdminLog");
const Notification = require("../models/Notification");
const Setting = require("../models/Setting");
const ApiUsage = require('../models/ApiUsage');
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const os = require('os');

// Helper to log admin actions
const logAdminAction = async (req, action, resource, resourceId, details = {}) => {
  try {
    await AdminLog.create({
      adminId: req.user._id,
      adminName: req.user.name,
      action,
      resource,
      resourceId,
      details
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
};

// 🔐 Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password, googleId } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });
    if (!password && !googleId) return res.status(400).json({ message: "Password required for non‑Google accounts" });
    
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password +passwordHash");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    if (!user.isAdminUser()) return res.status(403).json({ message: "Admin access only" });

    if (!user.hasPassword()) {
      if (!googleId) return res.status(400).json({ message: "This account uses Google login. Provide `googleId` to sign in." });
      if (user.googleId !== googleId) return res.status(401).json({ message: "Invalid Google credentials" });
    } else {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign({ id: user._id, role: "admin" }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" });
    res.json({ success: true, token, user: { id: user._id, email: user.email, role: "admin", name: user.name, picture: user.picture } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔐 Admin Google Login
exports.adminGoogleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Google token required" });
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    
    let user = await User.findOne({ email: payload.email });
    if (!user || !user.isAdminUser()) return res.status(401).json({ message: "Admin account not found" });

    if (!user.googleId) {
      user.googleId = payload.sub;
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id, role: "admin" }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" });
    res.json({ success: true, token: jwtToken, user: { id: user._id, email: user.email, role: "admin", name: user.name, picture: user.picture } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📊 Get Admin Stats
exports.getAdminStats = async (req, res) => {
  try {
    const [allUsers, guestUsages, allRecipes, apiUsages] = await Promise.all([
      User.find().select("-passwordHash -password").lean(),
      GuestUsage.find().sort({ lastUsed: -1 }).lean(),
      Recipe.find().sort({ createdAt: -1 }).lean(),
      ApiUsage.find().lean(),
    ]);

    const googleUsers = allUsers.filter(u => u.googleId && !u.passwordHash && !u.password);
    const emailUsers = allUsers.filter(u => (u.passwordHash || u.password) && !u.googleId);
    const hybridUsers = allUsers.filter(u => u.googleId && (u.passwordHash || u.password));

    const userRecipes = allRecipes.filter(r => r.createdBy);
    const guestRecipes = allRecipes.filter(r => !r.createdBy);

    const usageStats = {};
    apiUsages.forEach(entry => {
      const { apiKeyName, userId, count } = entry;
      if (!usageStats[apiKeyName]) usageStats[apiKeyName] = { total: 0, perUser: [] };
      usageStats[apiKeyName].total += count;
      if (userId) usageStats[apiKeyName].perUser.push({ id: userId, count });
    });

    const usageTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d.setHours(0,0,0,0));
      const dayEnd = new Date(d.setHours(23,59,59,999));
      
      const dayUsers = allUsers.filter(u => u.createdAt >= dayStart && u.createdAt <= dayEnd).length;
      const dayGuests = guestUsages.filter(g => g.lastUsed >= dayStart && g.lastUsed <= dayEnd).length;
      const dayAi = apiUsages.filter(a => a.lastUsed >= dayStart && a.lastUsed <= dayEnd).reduce((acc, curr) => acc + curr.count, 0) || 0; 
      // Note: for AI we just take count of keys used that day to approximate activity since we don't have time-series logs

      usageTrend.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        users: dayUsers,
        guests: dayGuests,
        ai: dayAi > 10 ? Math.floor(dayAi / 5) : dayAi // Scale down so chart looks reasonable if count is cumulative
      });
    }

    res.json({
      users: { total: allUsers.length, google: googleUsers.length, email: emailUsers.length, hybrid: hybridUsers.length },
      recipes: { total: allRecipes.length, userGenerated: userRecipes.length, guestGenerated: guestRecipes.length },
      guestUsage: { total: guestUsages.length, recentGuests: guestUsages.slice(0, 5) },
      usageStats,
      usageTrend,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👥 User Management
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash -password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash -password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-passwordHash -password");
    await logAdminAction(req, "UPDATE_USER", "User", user._id, req.body);
    res.json(user);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    await logAdminAction(req, "DELETE_USER", "User", req.params.id, { email: user?.email });
    res.json({ message: "User deleted" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// 🧑‍🤝‍🧑 Guest Management
exports.getAllGuests = async (req, res) => {
  try {
    const guests = await GuestUsage.find().sort({ lastUsed: -1 });
    res.json(guests);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.resetGuestUsage = async (req, res) => {
  try {
    const guest = await GuestUsage.findByIdAndUpdate(req.params.id, { usageCount: 0, features: {} }, { new: true });
    await logAdminAction(req, "RESET_GUEST", "GuestUsage", req.params.id);
    res.json(guest);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// 🍔 Recipe Management
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    await logAdminAction(req, "DELETE_RECIPE", "Recipe", req.params.id, { title: recipe?.title });
    res.json({ message: "Recipe deleted" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// 💬 Community (Reviews)
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    await logAdminAction(req, "DELETE_REVIEW", "Review", req.params.id);
    res.json({ message: "Review deleted" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// 🛡️ Security Logs
exports.getSecurityLogs = async (req, res) => {
  try {
    const logs = await AdminLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// 🔔 Notifications
exports.getNotifications = async (req, res) => {
  try {
    const notes = await Notification.find().populate('sentBy', 'name').sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.createNotification = async (req, res) => {
  try {
    const note = await Notification.create({ ...req.body, sentBy: req.user._id });
    await logAdminAction(req, "CREATE_NOTIFICATION", "Notification", note._id, { title: note.title });
    res.json(note);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// 🩺 System Health
exports.getSystemHealth = async (req, res) => {
  try {
    res.json({
      uptime: os.uptime(),
      memoryUsage: process.memoryUsage(),
      totalMem: os.totalmem(),
      freeMem: os.freemem(),
      cpus: os.cpus(),
      loadAvg: os.loadavg(),
      status: 'Healthy'
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// ⚙️ Settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    res.json(settings);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateSetting = async (req, res) => {
  try {
    const { key, value, description } = req.body;
    const setting = await Setting.findOneAndUpdate(
      { key },
      { value, description, updatedBy: req.user._id, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    await logAdminAction(req, "UPDATE_SETTING", "Setting", setting._id, { key });
    res.json(setting);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
