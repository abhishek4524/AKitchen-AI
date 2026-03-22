const Item = require('../models/Item');
const getRecipeImage = require('../utils/imageFetcher'); // Import the utility

// GET /items
exports.getItems = async (req, res) => {
  try {
    const { filter, search, category, sort } = req.query;
    let query = {};

    // Filter by done status
    if (filter === 'bought') query.done = true;
    else if (filter === 'pending') query.done = false;

    // Filter by category
    if (category && category !== 'all') query.category = category;

    // Search by name
    if (search) query.name = { $regex: search, $options: 'i' };

    let items = await Item.find(query);

    // Sort
    if (sort === 'price-asc') items.sort((a,b) => a.price - b.price);
    else if (sort === 'price-desc') items.sort((a,b) => b.price - a.price);
    else if (sort === 'name') items.sort((a,b) => a.name.localeCompare(b.name));

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /items
exports.addItem = async (req, res) => {
  try {
    let { name, category, price, image } = req.body;

    // If no image provided, fetch from Unsplash
    if (!image) {
      image = await getRecipeImage(name);
      if (!image) {
        // Fallback to a default grocery image if Unsplash fails
        image = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';
      }
    }

    const newItem = new Item({ name, category, price, image, done: false });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
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
    res.status(500).json({ error: err.message });
  }
};

// DELETE /items/:id
exports.deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /items
exports.clearAll = async (req, res) => {
  try {
    await Item.deleteMany({});
    res.json({ message: 'All items cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};