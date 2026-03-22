const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = router;