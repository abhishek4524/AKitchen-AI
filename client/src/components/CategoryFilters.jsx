import React from "react";

const categories = [
  { id: "all", name: "All", icon: "🍽️" },
  { id: "indian", name: "Indian", icon: "🍛" },
  { id: "south-indian", name: "South Indian", icon: "🥘" },
  { id: "non-veg", name: "Non-Veg", icon: "🍗" },
  { id: "vegetarian", name: "Vegetarian", icon: "🥬" },
  { id: "desserts", name: "Desserts", icon: "🍰" },
  { id: "snacks", name: "Snacks", icon: "🥨" },
  { id: "quick-easy", name: "Quick & Easy", icon: "⚡" },
  { id: "healthy", name: "Healthy", icon: "🥗" },
  { id: "breakfast", name: "Breakfast", icon: "🍳" }
];

const CategoryFilters = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Categories</h3>
        <span className="text-sm text-gray-500">
          {categories.length} categories
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.name)}
            className={`
              group relative px-4 py-2 rounded-full
              transition-all duration-300 transform
              hover:scale-105 active:scale-95
              flex items-center gap-2
              ${selectedCategory === category.name
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
              }
            `}
          >
            <span className="text-lg">{category.icon}</span>
            <span className="font-medium">{category.name}</span>
            
            {/* Active Indicator */}
            {selectedCategory === category.name && (
              <span className="absolute -top-1 -right-1 w-3 h-3 
                             bg-green-400 border-2 border-white 
                             rounded-full animate-pulse"></span>
            )}
          </button>
        ))}
      </div>

      {/* Active Filter Indicator */}
      {selectedCategory !== "All" && (
        <div className="mt-4 p-3 bg-purple-50 rounded-lg 
                      border border-purple-100 animate-fadeIn">
          <p className="text-sm text-purple-700">
            Active filter: <span className="font-semibold">{selectedCategory}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryFilters;