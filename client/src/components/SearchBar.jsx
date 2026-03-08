import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    // Real-time search (optional)
    onSearch(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search recipes by name, ingredient, or cuisine..."
          className="w-full px-6 py-4 pr-14 text-gray-700 
                     bg-white border-2 border-gray-200 
                     rounded-2xl outline-none
                     transition-all duration-300
                     focus:border-purple-400 focus:shadow-lg
                     group-hover:border-purple-300
                     placeholder:text-gray-400"
        />
        
        {/* Search Icon/Button */}
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2
                     w-10 h-10 bg-purple-600 hover:bg-purple-700
                     text-white rounded-xl
                     transition-all duration-300
                     hover:scale-105 active:scale-95
                     flex items-center justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Search Hint */}
        {searchTerm && (
          <div className="absolute left-0 right-0 top-full mt-2 
                         bg-white rounded-xl shadow-lg border border-gray-100
                         animate-fadeIn z-10">
            <p className="px-4 py-2 text-sm text-gray-500">
              Searching for: <span className="font-semibold text-purple-600">{searchTerm}</span>
            </p>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;