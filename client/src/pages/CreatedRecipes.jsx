import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowLeft, ChefHat, Calendar, Star } from "lucide-react";
// ✅ API base from environment variable

const CreatedRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCreatedRecipes();
  }, [token, navigate]);

  const fetchCreatedRecipes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data;
      setRecipes(userData.createdRecipes || []);
    } catch (err) {
      console.error("Error fetching created recipes:", err);
      setError("Failed to load your created recipes");
    } finally {
      setLoading(false);
    }
  };

  const RecipeCard = ({ recipe }) => (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/recipe/${recipe._id}`)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.image || "https://via.placeholder.com/400x300?text=No+Image"}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
          ⏱ {recipe.time || "30 min"}
        </div>
        {recipe.aiGenerated && (
          <div className="absolute top-3 left-3 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            🤖 AI Generated
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{recipe.title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Calendar size={14} />
          <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ChefHat size={14} />
          <span>{recipe.cuisine || "Various"}</span>
        </div>
        {recipe.rating && (
          <div className="flex items-center gap-1 mt-2">
            <Star size={14} className="text-yellow-500 fill-current" />
            <span className="text-sm text-gray-600">{recipe.rating}</span>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <Navbar />
        <div className="pt-24 pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-12 bg-white/50 rounded-xl mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-white/50 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <Navbar />
        <div className="pt-24 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12">
              <div className="text-red-500 mb-4 text-lg">{error}</div>
              <button
                onClick={fetchCreatedRecipes}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <button
              onClick={() => navigate("/profile")}
              className="p-2 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white transition-all duration-200 shadow-md"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                My Created Recipes
              </h1>
              <p className="text-gray-600 mt-2">
                Recipes you've created and shared
              </p>
            </div>
          </motion.div>

          {/* Recipes Grid */}
          <AnimatePresence mode="wait">
            {recipes.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {recipes.map((recipe, index) => (
                  <motion.div
                    key={recipe._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <RecipeCard recipe={recipe} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 max-w-md mx-auto">
                  <ChefHat size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No recipes created yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start creating delicious recipes with AI assistance!
                  </p>
                  <button
                    onClick={() => navigate("/ai-recipe")}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Create Your First Recipe
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats */}
          {recipes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{recipes.length}</div>
                  <div className="text-sm text-gray-600">Total Recipes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-600">
                    {recipes.filter(r => r.aiGenerated).length}
                  </div>
                  <div className="text-sm text-gray-600">AI Generated</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {recipes.filter(r => !r.aiGenerated).length}
                  </div>
                  <div className="text-sm text-gray-600">Manual</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {recipes.reduce((sum, r) => sum + (r.rating || 0), 0) / recipes.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Avg Rating</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreatedRecipes;