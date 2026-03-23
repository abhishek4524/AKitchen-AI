const Item = require("../models/Item");
const getRecipeImage = require("../utils/imageFetcher");

// GET /items (user-specific)
exports.getItems = async (req, res) => {
  try {
    const { filter, search, category, sort } = req.query;
    let query = { user: req.user.id };

    if (filter === "bought") query.done = true;
    else if (filter === "pending") query.done = false;

    if (category && category !== "all") query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };

    let items = await Item.find(query);

    if (sort === "price-asc") items.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") items.sort((a, b) => b.price - a.price);
    else if (sort === "name") items.sort((a, b) => a.name.localeCompare(b.name));

    res.json(items);
  } catch (err) {
    console.error("Error in getItems:", err); // log error
    res.status(500).json({ error: err.message });
  }
};

// POST /items (user-specific)
exports.addItem = async (req, res) => {
  try {
    let { name, category, price, image } = req.body;

    if (!image) {
      image = await getRecipeImage(name);
      if (!image) {
        image =
          "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80";
      }
    }

    const newItem = new Item({
      name,
      category,
      price,
      image,
      done: false,
      user: req.user.id,
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error("Error in addItem:", err);
    res.status(500).json({ error: err.message });
  }
};

// PUT /items/:id
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { done, name, category, price } = req.body;
    const update = {};
    if (done !== undefined) update.done = done;
    if (name) update.name = name;
    if (category) update.category = category;
    if (price) update.price = price;

    const updated = await Item.findByIdAndUpdate(id, update, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("Error in updateItem:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE /items/:id
exports.deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error("Error in deleteItem:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE /items (clear all for user)
exports.clearAll = async (req, res) => {
  try {
    await Item.deleteMany({ user: req.user.id });
    res.json({ message: "All items cleared" });
  } catch (err) {
    console.error("Error in clearAll:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET /items/count – count user's grocery items
exports.getItemCount = async (req, res) => {
  try {
    const count = await Item.countDocuments({ user: req.user.id });
    res.json({ count });
  } catch (err) {
    console.error("Error in getItemCount:", err);
    res.status(500).json({ error: err.message });
  }
};