import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RecipeCard from "../components/RecipeCard";
import { assets } from "../assets/assets";
import axios from "axios";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ingredients");
  const [servings, setServings] = useState(2);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(null);
  const token = localStorage.getItem("token");
   const [recommendedRecipes, setRecommendedRecipes] = useState([]);

   const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  
    useEffect(() => {
      const loadRecommendedRecipes = async () => {
        try {
          const response = await fetch(`${API_BASE}/recipes`);
          if (!response.ok) throw new Error("Unable to fetch recipes");
          const data = await response.json();
          const aiOnly = Array.isArray(data) ? data.filter((r) => r.aiGenerated) : [];
          setRecommendedRecipes(aiOnly.slice(0, 6));
        } catch (err) {
          console.error("Error loading recommended recipes:", err);
        }
      };
  
      loadRecommendedRecipes();
    }, []);
  

  useEffect(() => {
    fetchRecipeDetails();
  }, [id]);

  const fetchRecipeDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE}/recipes/${id}`);
      const recipeData = response.data;

      const transformedRecipe = {
        id: recipeData._id,
        title: recipeData.title,
        img: recipeData.image || assets.paneer,
        time: recipeData.time || "30 min",
        rating: 4.5,
        cuisine: recipeData.cuisine || "Other",
        difficulty: recipeData.difficulty || "Medium",
        ingredients: recipeData.ingredients || [],
        description: recipeData.description || "",
        steps: recipeData.steps || [],
        diet: recipeData.diet || "Non-Veg",
        createdBy: recipeData.createdBy,
        aiGenerated: recipeData.aiGenerated || false,
        createdAt: recipeData.createdAt,
      };
      setRecipe(transformedRecipe);
    } catch (err) {
      console.error("Error fetching recipe details:", err);
      setError("Failed to load recipe details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!token) {
      // Not logged in: redirect to login or show a modal
      const confirm = window.confirm("You need to log in to save recipes. Go to login?");
      if (confirm) navigate("/login");
      return;
    }

    if (saving) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/user/save/${recipe.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to save recipe");
      }

      setSavedMessage("Recipe saved successfully!");
      setTimeout(() => setSavedMessage(null), 3000);
    } catch (error) {
      console.error("Error saving recipe:", error);
      setSavedMessage(error.message);
      setTimeout(() => setSavedMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => window.print();
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: recipe.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const formatIngredient = (ing) => {
    if (typeof ing === "string") return ing;
    if (ing && typeof ing === "object") {
      const quantity = ing.quantity || "";
      const name = ing.name || "";
      return `${quantity} ${name}`.trim();
    }
    return String(ing);
  };

  const scaleIngredient = (ingredientStr) => {
    return ingredientStr.replace(/(\d+)(?:\s*\/\s*\d+)?/g, (match) => {
      if (match.includes("/")) {
        const [num, den] = match.split("/").map(Number);
        return Math.round((num / den) * servings * 2) / 2;
      }
      return parseInt(match) * (servings / 2);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-600">Loading recipe details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
            <span className="text-6xl mb-4 block">😕</span>
            <h3 className="text-2xl font-bold mb-2">Recipe Not Found</h3>
            <p className="text-gray-600 mb-6">{error || "The recipe you're looking for doesn't exist."}</p>
            <button
              onClick={() => navigate("/explore")}
              className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
            >
              Browse Recipes
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[65vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <img
          src={recipe.img}
          alt={recipe.title}
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = assets.paneer)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all z-20 shadow-md hover:shadow-lg"
          aria-label="Go back"
        >
          ←
        </button>

        {/* Title and Metadata */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                {recipe.cuisine}
              </span>
              {recipe.aiGenerated && (
                <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  AI Generated
                </span>
              )}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  recipe.difficulty === "Easy"
                    ? "bg-green-600"
                    : recipe.difficulty === "Medium"
                    ? "bg-yellow-600"
                    : "bg-red-600"
                }`}
              >
                {recipe.difficulty}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {recipe.title}
            </h1>
            <p className="text-lg text-gray-200 max-w-3xl">{recipe.description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-xl p-5 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">⏱️</div>
            <p className="text-gray-600 text-sm">Prep Time</p>
            <p className="font-bold text-lg">{recipe.time}</p>
          </div>
          <div className="bg-white rounded-xl p-5 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">⭐</div>
            <p className="text-gray-600 text-sm">Rating</p>
            <p className="font-bold text-lg">{recipe.rating} / 5</p>
          </div>
          <div className="bg-white rounded-xl p-5 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">👥</div>
            <p className="text-gray-600 text-sm">Servings</p>
            <div className="flex items-center justify-center gap-3 mt-1">
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors font-bold"
                aria-label="Decrease servings"
              >
                -
              </button>
              <span className="font-bold text-lg w-8 text-center">{servings}</span>
              <button
                onClick={() => setServings(servings + 1)}
                className="w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors font-bold"
                aria-label="Increase servings"
              >
                +
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">🔥</div>
            <p className="text-gray-600 text-sm">Calories</p>
            <p className="font-bold text-lg">~{Math.round(350 * (servings / 2))} kcal</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-10">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 text-white px-6 py-3 rounded-full transition-colors shadow-md hover:shadow-lg ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            <span>❤️</span> {saving ? "Saving..." : "Save Recipe"}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-300 transition-colors"
          >
            <span>🖨️</span> Print
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-300 transition-colors"
          >
            <span>📤</span> Share
          </button>
        </div>

        {/* Message feedback */}
        {savedMessage && (
          <div
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg transition-all ${
              savedMessage.includes("success")
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {savedMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-6">
            <button
              className={`pb-3 px-1 font-semibold transition-all relative ${
                activeTab === "ingredients"
                  ? "text-purple-600"
                  : "text-gray-600 hover:text-purple-600"
              }`}
              onClick={() => setActiveTab("ingredients")}
            >
              Ingredients
              {activeTab === "ingredients" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full"></div>
              )}
            </button>
            <button
              className={`pb-3 px-1 font-semibold transition-all relative ${
                activeTab === "instructions"
                  ? "text-purple-600"
                  : "text-gray-600 hover:text-purple-600"
              }`}
              onClick={() => setActiveTab("instructions")}
            >
              Instructions
              {activeTab === "instructions" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full"></div>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg mb-12 transition-all">
          {activeTab === "ingredients" ? (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span>🛒</span> Ingredients
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recipe.ingredients.map((ingredient, index) => {
                  const ingredientStr = formatIngredient(ingredient);
                  const scaledIngredient = scaleIngredient(ingredientStr);
                  return (
                    <label
                      key={index}
                      className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-gray-700">{scaledIngredient}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span>📖</span> Instructions
              </h2>
              <div className="space-y-8">
                {recipe.steps && recipe.steps.length > 0 ? (
                  recipe.steps.map((step, index) => (
                    <div key={index} className="flex gap-5 group">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-gray-700 leading-relaxed">
                          {typeof step === "string" ? step : step.text || JSON.stringify(step)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No instructions available for this recipe.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Chef's Tips */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 md:p-8 mb-12 border border-purple-100">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>💡</span> Chef's Tips
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-purple-600 mt-1">•</span>
              <span>For best results, bring ingredients to room temperature before starting.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 mt-1">•</span>
              <span>Adjust spices according to your taste preference.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 mt-1">•</span>
              <span>Garnish with fresh herbs before serving for extra flavor.</span>
            </li>
          </ul>
        </div>

        {/* Related Recipes */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
            {recommendedRecipes.length > 0 ? (
              recommendedRecipes.map((rec) => (
                <RecipeCard key={rec._id} recipe={rec} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No similar recipes available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RecipeDetails;