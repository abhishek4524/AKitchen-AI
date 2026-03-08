import React from "react";
import RecipeCard from "./RecipeCard";

const RecipeGrid = ({ recipes, isLoading }) => {
  
  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🍳</div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">
          No recipes to display
        </h3>
        <p className="text-gray-500">
          Try selecting a different category or check back later!
        </p>
      </div>
    );
  }

  // Recipe Grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe, index) => (
        <div
          key={recipe.id}
          className="transform transition-all duration-500 opacity-0 animate-slideUp"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <RecipeCard recipe={recipe} />
        </div>
      ))}
    </div>
  );
};

export default RecipeGrid;