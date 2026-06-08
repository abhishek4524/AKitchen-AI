const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const { protect } = require("../middleware/auth");

const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdminUser?.()) {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

// Admin login route (public)
router.post("/auth/login", adminController.adminLogin);
router.post("/auth/google", adminController.adminGoogleLogin);

// Admin-only routes (protected)
router.use(protect);
router.use(requireAdmin);

// Stats
router.get("/stats", adminController.getAdminStats);

// Users
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

// Guests
router.get("/guests", adminController.getAllGuests);
router.put("/guests/:id/reset", adminController.resetGuestUsage);

// Recipes
router.get("/recipes", adminController.getAllRecipes);
router.delete("/recipes/:id", adminController.deleteRecipe);

// Community / Reviews
router.get("/reviews", adminController.getAllReviews);
router.delete("/reviews/:id", adminController.deleteReview);

// Security Logs
router.get("/security-logs", adminController.getSecurityLogs);

// Notifications
router.get("/notifications", adminController.getNotifications);
router.post("/notifications", adminController.createNotification);

// System Health
router.get("/health", adminController.getSystemHealth);

// Settings
router.get("/settings", adminController.getSettings);
router.put("/settings", adminController.updateSetting);

module.exports = router;
