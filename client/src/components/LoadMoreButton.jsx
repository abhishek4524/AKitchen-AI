import React, { useState } from "react";

const LoadMoreButton = ({ onLoadMore }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    
    // Simulate loading more recipes
    setTimeout(() => {
      onLoadMore();
      setIsLoading(false);
    }, 1000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        group relative px-8 py-4 rounded-full font-semibold text-lg
        transition-all duration-300 transform
        ${isLoading 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105 hover:shadow-xl active:scale-95'
        }
        text-white shadow-lg
        overflow-hidden
      `}
    >
      {/* Background Animation */}
      <span className="absolute inset-0 bg-white/20 transform -skew-x-12 
                       -translate-x-full group-hover:translate-x-full 
                       transition-transform duration-700"></span>

      {/* Content */}
      <span className="relative flex items-center gap-3">
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Loading Recipes...</span>
          </>
        ) : (
          <>
            <span>Load More Recipes</span>
            <span className="text-xl transform group-hover:translate-y-0.5 
                           transition-transform">
              ↓
            </span>
          </>
        )}
      </span>
    </button>
  );
};

export default LoadMoreButton;