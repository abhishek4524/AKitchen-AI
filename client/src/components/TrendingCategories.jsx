import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Clock } from "lucide-react";
import { assets } from "../assets/assets";
import axios from "axios";

const TrendingCategories = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOriginalRecipes();
  }, []);

  const fetchOriginalRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("https://akitchen.vercel.app/api/recipes" || "https://www.akitchenai.in/api/recipes" || "http://localhost:5000/api/recipes");
      const allRecipes = response.data;

      // Filter for original (non-AI generated) recipes only
      const originalRecipes = allRecipes.filter(recipe => !recipe.aiGenerated);

      // Transform to match component format
      const transformedRecipes = originalRecipes.slice(0, 4).map((recipe) => ({
        id: recipe._id,
        name: recipe.title,
        image: recipe.image || assets.paneer,
        time: recipe.time || "30 min",
        rating: "4.5", // Default rating since not stored in model
      }));

      setRecipes(transformedRecipes);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError("Failed to load recipes");
      // Fallback to some default recipes if API fails
      setRecipes([
        {
          name: "Paneer Butter Masala",
          image: assets.paneer,
          time: "30 min",
          rating: "4.8",
        },
        {
          name: "Veg Biryani",
          image: assets.biryani,
          time: "40 min",
          rating: "4.7",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };
  return (
    <div className="w-full py-20 px-6 md:px-12 bg-[#fed348]">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Trending Recipes
      </h2>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchOriginalRecipes}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Recipes Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {recipes.length > 0 ? (
            recipes.map((recipe, index) => (
              <div
                key={recipe.id || index}
                onClick={() => handleRecipeClick(recipe.id)}
                className="bg-white rounded-2xl overflow-hidden shadow-md 
                hover:shadow-xl transition duration-300 cursor-pointer group"
              >
                {/* Image */}
                <div className="overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-52 object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">
                    {recipe.name}
                  </h3>

                  <div className="flex items-center justify-between mt-3 text-gray-600">
                    {/* Cooking Time */}
                    <div className="flex items-center gap-1">
                      <Clock size={18} />
                      <span>{recipe.time}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={18} fill="currentColor" />
                      <span className="text-gray-700">{recipe.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No original recipes available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrendingCategories;