import React, { useState } from "react";
import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RecipeResult from "../components/RecipeResult";
import RecipeCard from "../components/RecipeCard";
import SimilarRecipes from "../components/SimilarRecipes";
import ReviewForm from "../components/ReviewForm";
import ReviewSection from "../components/ReviewSection";

const AIRecipe = () => {
  const [ingredients, setIngredients] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [diet, setDiet] = useState("");

  const handleGenerate = () => {
    console.log({
      ingredients,
      cuisine,
      diet,
    });
  };

  return (
    <div>
      <Navbar />
      <div className="relative w-full min-h-screen flex flex-col items-center justify-start pt-24 bg-[#feb7bb]">
        {/* Hero Heading */}
        <div className="w-full flex flex-col items-center animate-fadeIn">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl fugaz-one-regular 
          lg:w-1/2 md:w-3/4 sm:w-4/5 w-9/10 text-center
          transition-all duration-700 hover:scale-105"
          >
            What Can You Cook Today?
          </h1>

          <p
            className="text-center mt-4 text-base sm:text-lg md:text-xl 
          text-gray-600 transition-all duration-500"
          >
            Type the ingredients you have and let AI create the perfect recipe.
          </p>
        </div>

        {/* Recipe Generator Card */}
        <div className="mt-10 bg-white shadow-xl rounded-2xl p-6 w-[90%] max-w-3xl">
          {/* Ingredient Input */}
          <input
            type="text"
            placeholder="Enter ingredients... (Example: Tomato, Onion, Paneer)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mt-5">
            {/* Cuisine */}
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="border p-2 rounded-lg"
            >
              <option value="">Cuisine</option>
              <option>Indian</option>
              <option>Italian</option>
              <option>Chinese</option>
              <option>Mexican</option>
            </select>

            {/* Diet */}
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className="border p-2 rounded-lg"
            >
              <option value="">Diet</option>
              <option>Veg</option>
              <option>Non-Veg</option>
              <option>Vegan</option>
              <option>Keto</option>
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white 
          font-semibold py-3 rounded-lg transition-all duration-300"
          >
            ✨ Generate Recipe
          </button>
        </div>
        {/* <div className="w-full h-[80vh] lg:h-[100vh] flex items-end">
          <img
            src={assets.aiRecipeHero}
            alt="Hero image"
            className="w-full h-full object-cover transition-all duration-1000 
                  ease-in-out
                  animate-slideUp pointer-events-none select-none"
          />
        </div> */}

        {/* Animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 1s ease-out forwards;
          }

          .animate-slideUp {
            animation: slideUp 1.2s ease-out forwards;
          }
        `}</style>
      </div>
      <RecipeResult />
      {/* <RecipeCard /> */}
      <SimilarRecipes />
      <ReviewSection />
      <Footer />
    </div>
  );
};

export default AIRecipe;
