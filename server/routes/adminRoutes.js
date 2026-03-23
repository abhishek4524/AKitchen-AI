const express = require("express");
const router = express.Router();
const { adminLogin, getAllUsers, getUserById } = require("../controller/adminController");
const { protect } = require("../middleware/auth");

// Admin login route
router.post("/auth/login", adminLogin);

// Admin-only routes
router.use(protect);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);

module.exports = router;
