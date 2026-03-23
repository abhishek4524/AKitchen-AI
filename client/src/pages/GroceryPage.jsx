import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";



// Default food images (fallback)
const foodImages = {
  vegetables:
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  fruits:
    "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  dairy:
    "https://images.unsplash.com/photo-1628088069254-d97f42a10e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    spices:
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    grains:
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    herbs:
    "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    grocery:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    shopping:
    "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  };
  
  // Predefined categories
const predefinedCategories = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Spices",
  "Grains",
  "Herbs",
  "Nuts",
  "Oils",
  "Other",
];

const GroceryPage = () => {
  // Input fields for new item
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("Other");
  const [itemPrice, setItemPrice] = useState(20);
  
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successItem, setSuccessItem] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // API state
  const [list, setList] = useState([]);
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  
  // Fetch items based on filters
  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.append("filter", filter);
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (sortBy !== "default") params.append("sort", sortBy);

      const response = await fetch(`${API_BASE_URL}/grocery/items?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        // Unauthorized – token invalid or expired
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setList(data);
      setError(null);
    } catch (err) {
      console.error("Fetch items error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch suggestions from backend
  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/grocery/suggestions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setSuggestedItems(data);
    } catch (err) {
      console.error("Fetch suggestions error:", err);
      setSuggestedItems([]);
    }
  };

  // Toggle done status
  const toggleItem = async (id, currentDone) => {
    try {
      const response = await fetch(`${API_BASE_URL}/grocery/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ done: !currentDone }),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      fetchItems();
    } catch (err) {
      console.error("Toggle item error:", err);
      alert("Error updating item: " + err.message);
    }
  };

  // Delete single item
  const deleteItem = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/grocery/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      fetchItems();
    } catch (err) {
      console.error("Delete item error:", err);
      alert("Error deleting item: " + err.message);
    }
  };

  // Clear all items
  const clearList = async () => {
    if (!window.confirm("Are you sure you want to clear all items?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/grocery/items`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      fetchItems();
    } catch (err) {
      console.error("Clear list error:", err);
      alert("Error clearing items: " + err.message);
    }
  };

  // Add new item
  const addItem = async () => {
    if (!itemName.trim()) return;

    const newItem = {
      name: itemName,
      category: itemCategory,
      price: itemPrice,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/grocery/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const added = await response.json();
      setSuccessItem(added.name);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2000);
      setItemName("");
      setItemCategory("Other");
      setItemPrice(20);
      fetchItems();
    } catch (err) {
      console.error("Add item error:", err);
      alert("Error adding item: " + err.message);
    }
  };

  // Add suggested item
  const addSuggestedItem = async (suggestedItem) => {
    try {
      const response = await fetch(`${API_BASE_URL}/grocery/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: suggestedItem.name,
          category: suggestedItem.category,
          price: suggestedItem.price,
          image: suggestedItem.image,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const added = await response.json();
      setSuccessItem(added.name);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2000);
      fetchItems();
    } catch (err) {
      console.error("Add suggested item error:", err);
      alert("Error adding item: " + err.message);
    }
  };

  // Load items and suggestions on mount and when filters change
  useEffect(() => {
    if (token) fetchItems();
  }, [filter, searchTerm, selectedCategory, sortBy, token]);

  useEffect(() => {
    if (token) fetchSuggestions();
  }, [token]);

  // Derived categories
  const categoriesFromItems = ["all", ...new Set(list.map((item) => item.category))];
  const allCategories = [...new Set([...predefinedCategories, ...list.map((item) => item.category)])];

  // Stats
  const totalItems = list.length;
  const bought = list.filter((i) => i.done).length;
  const pending = totalItems - bought;
  const totalCost = list.reduce((sum, item) => sum + item.price, 0);

  const statsCards = [
    { label: "Total Items", value: totalItems, icon: "🛒", color: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
    { label: "Bought", value: bought, icon: "✅", color: "from-green-500 to-green-600", bg: "bg-green-50" },
    { label: "Pending", value: pending, icon: "⏳", color: "from-orange-500 to-orange-600", bg: "bg-orange-50" },
    { label: "Total Cost", value: `₹${totalCost}`, icon: "💰", color: "from-purple-500 to-purple-600", bg: "bg-purple-50" },
  ];

  const getEmoji = (category) => {
    const emojis = {
      Spices: "🌶️",
      Dairy: "🥛",
      Vegetables: "🥕",
      Fruits: "🍎",
      Grains: "🌾",
      Herbs: "🌿",
      Nuts: "🥜",
      Oils: "🫒",
      Other: "🛒",
    };
    return emojis[category] || "🛒";
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f6a7a8] to-[#ffd6d9]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Smart Grocery with AI 🛒</h1>
          <p className="text-gray-700 max-w-xl mb-8">
            Generate your grocery list automatically from recipes. No manual effort — AI does everything for you.
          </p>
          <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
            <p className="text-gray-500 mb-4 text-sm">Example: Paneer Butter Masala</p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/ai-recipe")}
                className="bg-black text-white px-6 py-3 rounded-lg"
              >
                🍳 Generate Recipe First
              </button>
              <button
                onClick={() => navigate("/login")}
                className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100"
              >
                🔐 Login
              </button>
            </div>
          </div>
          <div className="flex gap-4 mt-6 text-gray-600 text-sm">
            <span>🧠 AI powered</span>
            <span>⚡ Instant list</span>
            <span>🛒 Smart tracking</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-r from-[#f6a7a8] to-[#f6a7a8] pt-32 pb-20 overflow-hidden">
        {/* Background Images with Parallax Effect */}
        <div className="absolute inset-0 opacity-15">
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            className="absolute left-0 top-10 w-96 h-96"
          >
            <img src={foodImages.vegetables} alt="Fresh vegetables" className="w-full h-full object-cover rounded-full opacity-30" />
          </motion.div>
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
            transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
            className="absolute right-0 bottom-10 w-96 h-96"
          >
            <img src={foodImages.fruits} alt="Fresh fruits" className="w-full h-full object-cover rounded-full opacity-30" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 30, repeat: Infinity, repeatType: "reverse" }}
            className="absolute left-1/4 top-1/4 w-64 h-64"
          >
            <img src={foodImages.spices} alt="Spices" className="w-full h-full object-cover rounded-full opacity-20" />
          </motion.div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/20"></div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
              animate={{ y: [null, -30, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-6"
            >
              <span className="bg-white/30 backdrop-blur-md px-6 py-2 rounded-full text-white font-semibold">
                🛒 Fresh & Smart Shopping
              </span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-4">
              Smart Grocery List
            </h1>
            <p className="text-white text-xl max-w-2xl mx-auto opacity-90 mb-8">
              Manage your ingredients for delicious recipes — all in one place.
            </p>
          </motion.div>

          {/* INPUT SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12"
          >
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Item Name Field */}
                <div className="relative">
                  <label className="block text-white text-sm font-medium mb-2 ml-1">🛒 Item Name</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🛒</span>
                    <input
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addItem()}
                      placeholder="e.g., Tomatoes, Paneer"
                      className="w-full pl-10 pr-4 py-3 rounded-xl shadow-lg focus:ring-4 focus:ring-green-200 outline-none transition-all bg-white/90 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Category Field */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2 ml-1">🏷️ Category (Type)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🏷️</span>
                    <select
                      value={itemCategory}
                      onChange={(e) => setItemCategory(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl shadow-lg focus:ring-4 focus:ring-green-200 outline-none transition-all bg-white/90 backdrop-blur-sm appearance-none"
                    >
                      {allCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price Field */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2 ml-1">💰 Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                    <input
                      type="number"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(Number(e.target.value))}
                      placeholder="e.g., 20"
                      className="w-full pl-10 pr-4 py-3 rounded-xl shadow-lg focus:ring-4 focus:ring-green-200 outline-none transition-all bg-white/90 backdrop-blur-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Add Button */}
              <div className="mt-6 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addItem}
                  className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-8 py-3 rounded-xl shadow-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <span>+</span> Add Item
                </motion.button>
              </div>

              {/* Success Message */}
              <AnimatePresence>
                {showSuccessMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 text-center bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg inline-block w-full"
                  >
                    ✓ {successItem} added successfully!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* STATS CARDS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16"
          >
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`${stat.bg} rounded-2xl p-6 shadow-lg backdrop-blur-sm border border-white/50 relative overflow-hidden group`}
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </p>
                  </div>
                  <span className="text-3xl">{stat.icon}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* MAIN GROCERY LIST SECTION */}
      <section className="max-w-6xl mx-auto px-4 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-white"
        >
          {/* Header with filters */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                My Grocery List
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl"
                >
                  📝
                </motion.span>
              </h2>
              <p className="text-gray-500 mt-1">
                {loading ? "Loading..." : `${list.length} items showing`}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 lg:flex-none">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full lg:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f6a7a8] outline-none bg-white/50"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>

              {/* Sort dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#f6a7a8] outline-none"
              >
                <option value="default">Sort by</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name</option>
              </select>

              {/* Category filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-[#f6a7a8] outline-none"
              >
                {categoriesFromItems.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>

              {/* Filter buttons */}
              <div className="flex gap-2">
                {["all", "bought", "pending"].map((filterType) => (
                  <motion.button
                    key={filterType}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(filterType)}
                    className={`px-4 py-2 rounded-xl font-medium capitalize transition-all ${
                      filter === filterType
                        ? "bg-gradient-to-r from-[#f6a7a8] to-[#f6a7a8] text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {filterType}
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearList}
                className="text-red-500 hover:text-red-700 font-medium px-4 py-2 border border-red-200 rounded-xl hover:bg-red-50 transition-all"
              >
                Clear All
              </motion.button>
            </div>
          </div>

          {/* Grocery items list */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="text-center py-16">Loading...</div>
            ) : error ? (
              <div className="text-center py-16 text-red-500">
                Error: {error}
                <br />
                <button
                  onClick={() => fetchItems()}
                  className="mt-2 text-blue-500 underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <AnimatePresence>
                {list.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <div className="text-6xl mb-4">🛒</div>
                    <p className="text-gray-500 text-lg">No items found. Add some groceries!</p>
                    <button
                      onClick={async () => {
                        const sampleItems = [
                          { name: "Paneer (200g)", category: "Dairy", price: 120, image: foodImages.dairy },
                          { name: "Tomatoes", category: "Vegetables", price: 40, image: foodImages.vegetables },
                        ];
                        for (let item of sampleItems) {
                          await fetch(`${API_BASE_URL}/items`, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(item),
                          });
                        }
                        fetchItems();
                      }}
                      className="mt-4 text-[#f6a7a8] hover:text-[#f6a7a8] font-medium"
                    >
                      Load sample items
                    </button>
                  </motion.div>
                ) : (
                  list.map((g, index) => (
                    <motion.div
                      key={g._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ scale: 1.01, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                      className="flex items-center justify-between bg-white p-4 rounded-xl hover:shadow-lg transition-all border border-gray-100"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          src={g.image}
                          alt={g.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <motion.input
                          whileTap={{ scale: 1.2 }}
                          type="checkbox"
                          checked={g.done}
                          onChange={() => toggleItem(g._id, g.done)}
                          className="w-5 h-5 accent-green-500 cursor-pointer"
                        />
                        <div className="flex-1">
                          <span className={`font-medium block ${g.done ? "line-through text-gray-400" : "text-gray-800"}`}>
                            {g.name}
                          </span>
                          <span className="text-xs text-gray-500">{g.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <p className="font-semibold text-gray-800">₹{g.price}</p>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteItem(g._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors text-xl"
                        >
                          🗑
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Progress bar */}
          {list.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round((bought / totalItems) * 100)}% completed</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(bought / totalItems) * 100}%` }}
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                />
              </div>
            </div>
          )}
        </motion.div>
      </section>

      {/* SUGGESTED ITEMS SECTION */}
      <section className="max-w-6xl mx-auto px-4 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h3 className="text-3xl font-bold text-gray-800 mb-3">Suggested for You</h3>
          <p className="text-gray-600">Based on popular items and your shopping habits</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {suggestedItems.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              No suggestions yet. Add some items to get personalized suggestions!
            </div>
          ) : (
            suggestedItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
                onClick={() => addSuggestedItem(item)}
              >
                <div className="relative h-40 overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <motion.div
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg"
                  >
                    <span className="text-xl">{getEmoji(item.category)}</span>
                  </motion.div>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-800 mb-1">{item.name}</p>
                  <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#f6a7a8]">₹{item.price}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-gray-100 hover:bg-[#f6a7a8] hover:text-white p-2 rounded-lg transition-all text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        addSuggestedItem(item);
                      }}
                    >
                      + Add
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative mt-20 overflow-hidden"
      >
        <div className="absolute inset-0">
          <img src={foodImages.shopping} alt="Shopping background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/90 to-yellow-300/90 backdrop-blur-sm"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <motion.h3 initial={{ x: -30 }} whileInView={{ x: 0 }} className="text-3xl font-bold text-gray-900 mb-3">
                Plan Your Meals & Auto-Add Ingredients
              </motion.h3>
              <motion.p initial={{ x: -30 }} whileInView={{ x: 0 }} transition={{ delay: 0.1 }} className="text-gray-800 text-lg">
                Let AI create a weekly plan and add groceries automatically.
              </motion.p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white px-10 py-4 rounded-xl font-semibold transition-all shadow-xl flex items-center gap-2 text-lg"
            >
              <span>✨</span> Get Meal Planner
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Add custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f6a7a8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f6a7a8;
        }
      `}</style>

      <Footer />
    </div>
  );
};

export default GroceryPage;