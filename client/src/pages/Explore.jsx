import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { assets } from "../assets/assets";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ✅ API base URL – defined once at module level (or inside component)
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// ======================== RECIPE CARD COMPONENT ========================
const RecipeCard = ({ recipe, index, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group animate-fadeIn cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onQuickView(recipe)}
    >
      <div className="overflow-hidden h-52">
        <img
          src={recipe.img || recipe.image || assets.paneer}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          alt={recipe.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = assets.paneer;
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform transition-transform duration-300">
        <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-purple-200 transition-colors">
          {recipe.title}
        </h3>
        <div className="flex items-center gap-3 text-sm mb-2">
          <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
            {recipe.cuisine || "Other"}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              recipe.difficulty === "Easy"
                ? "bg-green-500/30"
                : recipe.difficulty === "Medium"
                ? "bg-yellow-500/30"
                : "bg-red-500/30"
            } backdrop-blur-sm`}
          >
            {recipe.difficulty || "Medium"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1">
              <span className="text-yellow-300">⏱️</span>{" "}
              {recipe.time || "30 min"}
            </span>
            <span className="flex items-center gap-1">
              <span className="text-yellow-300">⭐</span>{" "}
              {recipe.rating || recipe.averageRating || 4.5}
            </span>
          </div>
          <button
            className={`bg-white text-purple-600 px-3 py-1 rounded-full text-xs font-semibold transform transition-all duration-300 ${
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            } hover:bg-purple-600 hover:text-white`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(recipe);
            }}
          >
            Quick View
          </button>
        </div>
      </div>
    </div>
  );
};

// ======================== SECTION COMPONENT ========================
const Section = ({ title, recipes, onQuickView }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedRecipes = showAll ? recipes : recipes.slice(0, 4);

  if (!recipes || recipes.length === 0) return null;

  return (
    <div className="mt-16 animate-slideUp">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          {title}
        </h2>
        {recipes.length > 4 && (
          <button
            className="group flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-300"
            onClick={() => setShowAll(!showAll)}
          >
            <span>{showAll ? "Show Less" : "View All"}</span>
            <span
              className={`transform transition-transform duration-300 ${
                showAll ? "rotate-180" : "group-hover:translate-x-1"
              }`}
            >
              {showAll ? "↑" : "→"}
            </span>
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedRecipes.map((recipe, index) => (
          <RecipeCard
            key={recipe.id || recipe._id}
            recipe={recipe}
            index={index}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </div>
  );
};

// ======================== QUICK VIEW MODAL ========================
const QuickViewModal = ({ recipe, onClose }) => {
  const navigate = useNavigate();

  if (!recipe) return null;

  const handleViewFullRecipe = () => {
    navigate(`/recipe/${recipe.id || recipe._id}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={recipe.img || recipe.image || assets.paneer}
            alt={recipe.title}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.target.src = assets.paneer;
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>

          <div className="flex gap-4 mb-4 flex-wrap">
            <span className="flex items-center gap-1 bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
              ⏱️ {recipe.time || "30 min"}
            </span>
            <span className="flex items-center gap-1 bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full">
              ⭐ {recipe.rating || recipe.averageRating || 4.5}
            </span>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              {recipe.cuisine || "Other"}
            </span>
            {recipe.diet && (
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full">
                {recipe.diet}
              </span>
            )}
            {recipe.aiGenerated && (
              <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                🤖 AI Generated
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-4">
            {recipe.description || "No description available."}
          </p>

          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <>
              <h3 className="font-semibold mb-2">Ingredients:</h3>
              <ul className="list-disc list-inside mb-4 text-gray-600">
                {recipe.ingredients.map((ing, i) => {
                  let ingredientText = "";
                  if (typeof ing === "string") {
                    ingredientText = ing;
                  } else if (ing && typeof ing === "object") {
                    ingredientText = `${ing.quantity || ""} ${ing.name || ""}`.trim();
                    if (!ingredientText) ingredientText = ing.name || JSON.stringify(ing);
                  } else {
                    ingredientText = String(ing);
                  }
                  return <li key={i}>{ingredientText}</li>;
                })}
              </ul>
            </>
          )}

          <button
            onClick={handleViewFullRecipe}
            className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold"
          >
            View Full Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

// ======================== MAIN EXPLORE PAGE ========================
const ExplorePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [displayCount, setDisplayCount] = useState(12);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categories with default counts
  const [categories, setCategories] = useState([
    { name: "All", icon: "🍽️", count: 0 },
    { name: "Indian", icon: "🍛", count: 0 },
    { name: "Italian", icon: "🍝", count: 0 },
    { name: "Chinese", icon: "🥡", count: 0 },
    { name: "Mexican", icon: "🌮", count: 0 },
    { name: "Healthy", icon: "🥗", count: 0 },
    { name: "Quick & Easy", icon: "⚡", count: 0 },
    { name: "Desserts", icon: "🍰", count: 0 },
  ]);

  // Fetch recipes from server
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Inject styles once on mount and clean up on unmount
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE}/recipes`);
      const recipes = response.data;

      // Transform server data to match frontend format
      const transformedRecipes = recipes.map((recipe) => ({
        id: recipe._id,
        _id: recipe._id,
        title: recipe.title,
        image: recipe.image || assets.paneer,
        img: recipe.image || assets.paneer,
        time: recipe.time || recipe.cookingTime || "30 min",
        rating: recipe.averageRating || 4.5,
        cuisine: recipe.cuisine || "Other",
        difficulty: recipe.difficulty || "Medium",
        category: recipe.aiGenerated ? "aiGenerated" : "trending",
        ingredients: recipe.ingredients || [],
        description: recipe.description || "",
        diet: recipe.diet || "Non-Veg",
        createdBy: recipe.createdBy,
        aiGenerated: recipe.aiGenerated || false,
        createdAt: recipe.createdAt,
        instructions: recipe.instructions || [],
        tags: recipe.tags || [],
      }));

      setAllRecipes(transformedRecipes);
      setFilteredRecipes(transformedRecipes);

      // Update category counts
      updateCategoryCounts(transformedRecipes);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError(
        err.response?.data?.message ||
        "Failed to load recipes. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateCategoryCounts = (recipes) => {
    setCategories((prev) =>
      prev.map((cat) => {
        let count = 0;
        const catLower = cat.name.toLowerCase();

        switch (cat.name) {
          case "All":
            count = recipes.length;
            break;
          case "Indian":
            count = recipes.filter(
              (r) => r.cuisine?.toLowerCase() === "indian"
            ).length;
            break;
          case "Italian":
            count = recipes.filter(
              (r) => r.cuisine?.toLowerCase() === "italian"
            ).length;
            break;
          case "Chinese":
            count = recipes.filter(
              (r) => r.cuisine?.toLowerCase() === "chinese"
            ).length;
            break;
          case "Mexican":
            count = recipes.filter(
              (r) => r.cuisine?.toLowerCase() === "mexican"
            ).length;
            break;
          case "Healthy":
            // Check diet, tags, or description for healthy keywords
            count = recipes.filter(
              (r) =>
                r.diet?.toLowerCase() === "healthy" ||
                (r.tags && r.tags.some((t) => t.toLowerCase() === "healthy")) ||
                r.description?.toLowerCase().includes("healthy")
            ).length;
            break;
          case "Quick & Easy":
            count = recipes.filter((r) => {
              const difficulty = r.difficulty?.toLowerCase();
              const timeValue = parseInt(r.time) || 0;
              return difficulty === "easy" || timeValue <= 30;
            }).length;
            break;
          case "Desserts":
            count = recipes.filter(
              (r) =>
                r.cuisine?.toLowerCase() === "desserts" ||
                (r.tags && r.tags.some((t) => t.toLowerCase() === "dessert")) ||
                r.category?.toLowerCase() === "desserts"
            ).length;
            break;
          default:
            count = 0;
        }
        return { ...cat, count };
      })
    );
  };

  // Filter recipes based on search and category
  useEffect(() => {
    if (allRecipes.length === 0) return;

    let filtered = [...allRecipes];

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((recipe) => {
        const cuisine = recipe.cuisine?.toLowerCase() || "";
        const diet = recipe.diet?.toLowerCase() || "";
        const difficulty = recipe.difficulty?.toLowerCase() || "";
        const tags = (recipe.tags || []).map((t) => t.toLowerCase());
        const timeValue = parseInt(recipe.time) || 0;

        switch (selectedCategory) {
          case "Indian":
            return cuisine === "indian";
          case "Italian":
            return cuisine === "italian";
          case "Chinese":
            return cuisine === "chinese";
          case "Mexican":
            return cuisine === "mexican";
          case "Healthy":
            return (
              diet === "healthy" ||
              tags.includes("healthy") ||
              recipe.description?.toLowerCase().includes("healthy")
            );
          case "Quick & Easy":
            return difficulty === "easy" || timeValue <= 30;
          case "Desserts":
            return (
              cuisine === "desserts" ||
              tags.includes("dessert") ||
              recipe.category?.toLowerCase() === "desserts"
            );
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (recipe) =>
          recipe.title?.toLowerCase().includes(term) ||
          recipe.cuisine?.toLowerCase().includes(term) ||
          (recipe.ingredients &&
            recipe.ingredients.some((i) =>
              (typeof i === "string" ? i : i.name || "").toLowerCase().includes(term)
            )) ||
          recipe.description?.toLowerCase().includes(term) ||
          recipe.diet?.toLowerCase().includes(term)
      );
    }

    setFilteredRecipes(filtered);
  }, [selectedCategory, searchTerm, allRecipes]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by useEffect
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 8);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  // Helper functions for sections – these operate on the full allRecipes dataset,
  // so they are unaffected by filters/search.
  const getTrendingRecipes = () => {
    // Simple trending logic: sort by rating (or could be based on popularity)
    return [...allRecipes]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 8);
  };

  const getRecentRecipes = () => {
    return [...allRecipes]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 8);
  };

  const getAiGeneratedRecipes = () => {
    return allRecipes.filter((r) => r.aiGenerated === true).slice(0, 8);
  };

  const trendingRecipes = getTrendingRecipes();
  const aiGeneratedRecipes = getAiGeneratedRecipes();
  const recentRecipes = getRecentRecipes();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading delicious recipes...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <span className="text-6xl mb-4 block">😕</span>
            <h3 className="text-2xl font-bold mb-2">Oops!</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchRecipes}
              className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />

      {/* Quick View Modal */}
      {selectedRecipe && (
        <QuickViewModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* HERO SECTION */}
      <div className="relative bg-gradient-to-r from-purple-200 to-purple-100 py-20 overflow-hidden">
        {/* Background images */}
        <div className="absolute left-0 top-0 w-64 h-full opacity-10">
          <img
            src={assets.paneer}
            alt=""
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
        </div>
        <div className="absolute right-0 top-0 w-64 h-full opacity-10">
          <img
            src={assets.biryani}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Floating icons */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 animate-float">
            <span className="text-4xl opacity-20">🍜</span>
          </div>
          <div className="absolute bottom-10 right-1/4 animate-float-delayed">
            <span className="text-4xl opacity-20">🍛</span>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 text-center z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fadeInDown">
            Explore <span className="text-purple-600">Recipes</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto animate-fadeInUp">
            Discover {allRecipes.length} delicious recipes created by AI and our community
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white shadow-xl rounded-full overflow-hidden max-w-2xl mx-auto transform hover:scale-105 transition-transform duration-300 animate-fadeIn"
          >
            <input
              type="text"
              placeholder="Search recipes, ingredients, cuisines..."
              className="flex-1 px-6 py-4 outline-none text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-8 py-4 font-semibold hover:bg-purple-700 transition-colors duration-300 flex items-center gap-2"
            >
              <span>🔍</span>
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Search Results Count */}
          {searchTerm && (
            <p className="mt-4 text-gray-600 animate-fadeIn">
              Found {filteredRecipes.length} recipes matching "{searchTerm}"
            </p>
          )}

          {/* Category Filters */}
          <div className="flex justify-center gap-3 flex-wrap mt-8 px-4 animate-fadeInUp">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-full shadow-sm transition-all duration-300 transform hover:-translate-y-1 ${
                  selectedCategory === cat.name
                    ? "bg-purple-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 hover:shadow"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {cat.count}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="white"
              fillOpacity="1"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-4 pb-20 relative z-10">
        {filteredRecipes.length > 0 ? (
          <>
            {selectedCategory === "All" && !searchTerm ? (
              // Show all sections when no filters are applied
              <>
                {trendingRecipes.length > 0 && (
                  <Section
                    title="🔥 Trending Recipes"
                    recipes={trendingRecipes}
                    onQuickView={setSelectedRecipe}
                  />
                )}

                {recentRecipes.length > 0 && (
                  <Section
                    title="🆕 Recently Added"
                    recipes={recentRecipes}
                    onQuickView={setSelectedRecipe}
                  />
                )}

                {aiGeneratedRecipes.length > 0 && (
                  <Section
                    title="✨ AI Generated Recipes"
                    recipes={aiGeneratedRecipes}
                    onQuickView={setSelectedRecipe}
                  />
                )}
              </>
            ) : (
              // Show filtered results
              <div className="mt-16">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                    {searchTerm
                      ? `Search Results for "${searchTerm}"`
                      : `${selectedCategory} Recipes`}
                  </h2>
                  <span className="text-gray-600">
                    {filteredRecipes.length} recipes found
                  </span>
                </div>

                {filteredRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredRecipes
                      .slice(0, displayCount)
                      .map((recipe, index) => (
                        <RecipeCard
                          key={recipe.id || recipe._id}
                          recipe={recipe}
                          index={index}
                          onQuickView={setSelectedRecipe}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No recipes found in this category.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Load More Button */}
            {filteredRecipes.length > displayCount && (
              <div className="flex justify-center mt-16">
                <button
                  onClick={handleLoadMore}
                  className="group bg-black text-white px-8 py-4 rounded-full hover:bg-purple-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center gap-3"
                >
                  <span className="font-semibold">Load More Recipes</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
              </div>
            )}
          </>
        ) : (
          // No results found
          <div className="text-center py-16 animate-fadeIn">
            <span className="text-6xl mb-4 block">😕</span>
            <h3 className="text-2xl font-bold mb-2">No Recipes Found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any recipes matching your criteria.
            </p>
            <button
              onClick={clearFilters}
              className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

// ======================== STYLES ========================
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  @keyframes float-delayed {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
  .animate-fadeInDown {
    animation: fadeInDown 0.6s ease-out forwards;
  }
  .animate-fadeInUp {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  .animate-slideUp {
    animation: slideUp 0.5s ease-out forwards;
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  .animate-float-delayed {
    animation: float-delayed 3.5s ease-in-out infinite;
  }
`;

export default ExplorePage;