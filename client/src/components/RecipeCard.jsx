import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    // Add your save logic here
  };

  const handleClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden
                 cursor-pointer transform transition-all duration-300
                 hover:shadow-2xl hover:-translate-y-2"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-700
                     group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent 
                        transition-opacity duration-300
                        ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          
          {/* Quick View Button */}
          <button className="absolute bottom-4 left-1/2 -translate-x-1/2
                           bg-white text-purple-600 px-4 py-2 rounded-full
                           font-semibold transform transition-all duration-300
                           hover:scale-105 hover:bg-purple-600 hover:text-white">
            Quick View
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full
                     shadow-lg flex items-center justify-center
                     transform transition-all duration-300
                     hover:scale-110 active:scale-95"
        >
          <span className={`text-xl transition-colors duration-300
                          ${isSaved ? 'text-red-500' : 'text-gray-400'}`}>
            {isSaved ? '❤️' : '🤍'}
          </span>
        </button>

        {/* Category Tag */}
        <span className="absolute top-3 left-3 px-3 py-1 bg-purple-600 
                         text-white text-xs font-semibold rounded-full
                         shadow-lg">
          {recipe.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 
                       group-hover:text-purple-600 transition-colors">
          {recipe.title}
        </h3>

        {/* Recipe Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            ⏱ {recipe.time}
          </span>
          <span className="flex items-center gap-1">
            📊 {recipe.difficulty}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="font-semibold">{recipe.rating}</span>
            <span className="text-gray-400 text-sm">(120 reviews)</span>
          </div>
          
          {/* View Recipe Button */}
          <button className="text-purple-600 font-semibold text-sm
                           group-hover:translate-x-2 transition-transform">
            View Recipe →
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;