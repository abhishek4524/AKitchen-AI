const router = require("express").Router();
const { protect } = require("../middleware/auth");
const {
  getItems,
  addItem,
  updateItem,
  deleteItem,
  clearAll,
  getItemCount, // we'll add this
} = require("../controller/itemController");

// All routes below require authentication
router.use(protect);

router.get("/items", getItems);
router.post("/items", addItem);
router.put("/items/:id", updateItem);
router.delete("/items/:id", deleteItem);
router.delete("/items", clearAll);
router.get("/items/count", getItemCount); // for profile stats

module.exports = router;