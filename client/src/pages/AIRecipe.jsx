import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReviewSection from "../components/ReviewSection";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// ✅ API base from environment variable
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const AIRecipe = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Common state for both logged-in and logged-out views
  const [demoIngredients, setDemoIngredients] = useState("");
  const [demoRecipe, setDemoRecipe] = useState(null);

  // State for logged-in version
  const [ingredients, setIngredients] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [diet, setDiet] = useState("");
  const [saved, setSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Fetch recommended recipes
  useEffect(() => {
    const loadRecommended = async () => {
      try {
        const response = await fetch(`${API_BASE}/recipes`);
        if (!response.ok) throw new Error("Failed to fetch recipes");
        const data = await response.json();
        const aiOnly = Array.isArray(data) ? data.filter((r) => r.aiGenerated) : [];
        setRecommendedRecipes(aiOnly.slice(0, 6));
      } catch (err) {
        console.error("Error loading recommended recipes:", err);
      }
    };
    loadRecommended();
  }, []);

  // ✅ Generate recipe with auth token
  const handleGenerate = async () => {
    setIsGenerating(true);
    setShowRecipe(false);
    try {
      const response = await fetch(`${API_BASE}/ai/generate-recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ingredients, cuisine, diet }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Adjust if recipe is nested inside a property like `data.recipe`
      setGeneratedRecipe(data.recipe || data);
      setShowRecipe(true);
    } catch (error) {
      console.error("Generate error:", error);
      alert(`Generation failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // ✅ Save recipe
  const handleSave = async () => {
    if (!generatedRecipe?._id) {
      alert("No recipe to save");
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/user/save/${generatedRecipe._id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Save failed");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error(error);
      alert(`Save failed: ${error.message}`);
    }
  };

  // ✅ Add ingredients to grocery list
  const handleAddToGrocery = async () => {
    if (!generatedRecipe?.ingredients) return;

    try {
      for (const ingredient of generatedRecipe.ingredients) {
        const name = typeof ingredient === "string" ? ingredient : `${ingredient.quantity || ""} ${ingredient.name}`.trim();
        await fetch(`${API_BASE}/grocery/items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            category: "Recipe Ingredients",
            price: 0,
          }),
        });
      }
      alert("Ingredients added to grocery list!");
    } catch (error) {
      console.error(error);
      alert("Failed to add ingredients to grocery");
    }
  };

  // ✅ Recipe Card component
  const RecipeCard = ({ recipe }) => (
    <motion.div
      whileHover={{ y: -10 }}
      onClick={() => navigate(`/recipe/${recipe._id || recipe.id}`)}
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.image || "https://via.placeholder.com/400x300?text=Recipe"}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
          ⏱ {recipe.time || "30 mins"}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
        <div className="flex justify-between text-sm text-gray-600">
          <span>🍛 {recipe.cuisine || "Various"}</span>
          <span>📊 {recipe.difficulty || "Medium"}</span>
        </div>
      </div>
    </motion.div>
  );



  // ========== RENDER LOGGED-IN VERSION ==========
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#feb7bb] to-[#ffd6d9]">
      <Navbar />

      <div className="relative min-h-screen pt-24 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute left-0 top-1/4 w-64 h-64 opacity-20 hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt=""
            className="w-full h-full object-cover rounded-full blur-sm"
          />
        </div>
        <div className="absolute right-0 bottom-1/4 w-80 h-80 opacity-20 hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt=""
            className="w-full h-full object-cover rounded-full blur-sm"
          />
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text">
            What Can You Cook Today?
          </h1>
          <p className="text-gray-700 mt-6 text-lg md:text-xl max-w-2xl mx-auto">
            Type the ingredients you have and let AI create the perfect recipe for you in seconds.
          </p>
        </motion.div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 mt-12 px-4"
        >
          <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 w-full max-w-3xl mx-auto border border-white/20">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter ingredients.. (Example: Tomato, Onion, Paneer)"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl p-4 pr-12 text-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-300 outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">🥘</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="flex-1 border-2 border-gray-200 p-3 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none bg-white"
              >
                <option value="">🌍 Select Cuisine</option>
                <option>Indian</option>
                <option>Italian</option>
                <option>Chinese</option>
                <option>Mexican</option>
                <option>Japanese</option>
                <option>Thai</option>
              </select>

              <select
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                className="flex-1 border-2 border-gray-200 p-3 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none bg-white"
              >
                <option value="">🥗 Select Diet</option>
                <option>Vegetarian</option>
                <option>Non-Veg</option>
                <option>Vegan</option>
                <option>Keto</option>
                <option>Gluten-Free</option>
              </select>
            </div>

            <div className="flex items-center gap-2 mt-6 flex-wrap">
              <span className="text-gray-500 font-medium">Try:</span>
              {["Paneer", "Pasta", "Chicken", "Egg", "Tofu", "Mushroom"].map((item) => (
                <motion.button
                  key={item}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIngredients(item)}
                  className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all duration-300 text-sm font-medium"
                >
                  🍳 {item}
                </motion.button>
              ))}
            </div>
            {
              token ?(
              <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70"
              >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                "🍳 Generate Recipe"
              )}
            </motion.button>
              ) : (<motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowLoginModal(true)}
              className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70"
              >
                  Generate Recipe
            </motion.button>

              )
        }
          </div>
        </motion.div>

        {/* Generated Recipe */}
        <AnimatePresence>
          {showRecipe && generatedRecipe && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 mt-16 px-4 pb-16"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl mx-auto overflow-hidden">
                {/* Image */}
                <div className="relative h-96 overflow-hidden group">
                  <img
                    src={generatedRecipe.image || "https://via.placeholder.com/800x400?text=Recipe"}
                    alt={generatedRecipe.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 text-white">
                    <motion.h2 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-5xl font-bold mb-3">
                      {generatedRecipe.title}
                    </motion.h2>
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-4 text-sm">
                      <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">⏱ {generatedRecipe.time || "N/A"}</span>
                      <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">🍽 {generatedRecipe.servings || "2 servings"}</span>
                      <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">📊 {generatedRecipe.difficulty || "Medium"}</span>
                      <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">🍛 {generatedRecipe.cuisine || cuisine || "Various"}</span>
                    </motion.div>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {generatedRecipe.nutrition && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(generatedRecipe.nutrition).map(([key, value], idx) => (
                        <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * idx }} whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl text-center">
                          <p className="text-gray-500 text-sm capitalize">{key}</p>
                          <p className="font-bold text-lg text-purple-600">{value}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                      <h3 className="font-bold text-2xl mb-4 flex items-center gap-2"><span>🛒</span> Ingredients</h3>
                      <div className="space-y-2">
                        {generatedRecipe.ingredients?.map((item, i) => {
                          const ingredientText = typeof item === "string" ? item : `${item.quantity || ""} ${item.name}`.trim();
                          return (
                            <motion.label key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group">
                              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 transition-all group-hover:scale-110" />
                              <span className="text-gray-700">{ingredientText}</span>
                            </motion.label>
                          );
                        })}
                      </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                      <h3 className="font-bold text-2xl mb-4 flex items-center gap-2"><span>📝</span> Instructions</h3>
                      <div className="space-y-3">
                        {generatedRecipe.steps?.length > 0 ? (
                          generatedRecipe.steps.map((step, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }} className="flex gap-3 bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition-colors">
                              <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                              <p className="text-gray-700">{step}</p>
                            </motion.div>
                          ))
                        ) : (
                          <p className="text-gray-500">No instructions available.</p>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {generatedRecipe.chefTips?.length > 0 && (
                    <div className="bg-amber-50 p-4 rounded-xl">
                      <h4 className="font-bold mb-2">💡 Chef’s Tips</h4>
                      <ul className="list-disc pl-5 space-y-1">{generatedRecipe.chefTips.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${saved ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}>
                      {saved ? "❤️ Saved" : "❤️ Save Recipe"}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddToGrocery} className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold transition-all duration-300">
                      🛒 Add to Grocery
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300">
                      📤 Share
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommended Recipes */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="relative z-10 w-full flex flex-col items-center mt-24 px-4 pb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {recommendedRecipes.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)}
          </div>
        </motion.div>
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-8 rounded-2xl shadow-2xl max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Login Required</h3>
              <p className="mb-6 text-gray-600">Please login first to generate AI recipes.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => { setShowLoginModal(false); navigate('/login'); }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReviewSection />
      <Footer />
    </div>
  );
};

export default AIRecipe;