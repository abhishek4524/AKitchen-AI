import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchSavedRecipes();
  }, [token, navigate]);

  const fetchSavedRecipes = async () => {
    try {
      const res = await fetch(`${API_BASE}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRecipes(data.savedRecipes || []);
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#feb7bb] to-[#ffd6d9]">
      <Navbar />
      <div className="py-24 px-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Saved Recipes</h1>
        {recipes.length === 0 ? (
          <p className="text-gray-600">No saved recipes yet. Start saving from the AI Recipe page!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg">{recipe.title}</h3>
                  <p className="text-gray-500 text-sm">{recipe.time}</p>
                  <button
                    onClick={() => navigate(`/recipe/${recipe._id}`)}
                    className="mt-2 text-purple-600 hover:underline"
                  >
                    View Recipe →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SavedRecipes;