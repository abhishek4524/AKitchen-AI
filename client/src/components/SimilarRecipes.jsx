import React from "react";
import RecipeCard from "./RecipeCard";

const SimilarRecipes = ({ recipes }) => {
  if (!recipes || recipes.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center mt-16">
      <h2 className="text-3xl font-bold mb-8">Similar Recipes</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-[90%] max-w-6xl">
        {recipes.map((recipe, index) => (
          <RecipeCard key={index} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default SimilarRecipes;