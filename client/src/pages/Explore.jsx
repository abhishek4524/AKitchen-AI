import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import CategoryFilters from "../components/CategoryFilters";
import RecipeGrid from "../components/RecipeGrid";
import LoadMoreButton from "../components/LoadMoreButton";
import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Sample recipe data (replace with your actual data source)
const sampleRecipes = [
  {
    id: 1,
    title: "Paneer Butter Masala",
    image: assets.paneer || "https://via.placeholder.com/300x200",
    time: "30 mins",
    difficulty: "Medium",
    rating: 4.5,
    category: "Indian"
  },
  {
    id: 2,
    title: "Vegetable Biryani",
    image: assets.biryani || "https://via.placeholder.com/300x200",
    time: "45 mins",
    difficulty: "Hard",
    rating: 4.8,
    category: "Indian"
  },
  {
    id: 3,
    title: "Masala Dosa",
    image: assets.dosa || "https://via.placeholder.com/300x200",
    time: "25 mins",
    difficulty: "Easy",
    rating: 4.6,
    category: "South Indian"
  },
  {
    id: 4,
    title: "Chicken Curry",
    image: assets.chicken || "https://via.placeholder.com/300x200",
    time: "40 mins",
    difficulty: "Medium",
    rating: 4.7,
    category: "Non-Veg"
  },
  {
    id: 5,
    title: "Palak Paneer",
    image: assets.palak || "https://via.placeholder.com/300x200",
    time: "35 mins",
    difficulty: "Medium",
    rating: 4.4,
    category: "Vegetarian"
  },
  {
    id: 6,
    title: "Gulab Jamun",
    image: assets.gulab || "https://via.placeholder.com/300x200",
    time: "20 mins",
    difficulty: "Easy",
    rating: 4.9,
    category: "Desserts"
  },
  {
    id: 7,
    title: "Chole Bhature",
    image: assets.chole || "https://via.placeholder.com/300x200",
    time: "50 mins",
    difficulty: "Hard",
    rating: 4.7,
    category: "Indian"
  },
  {
    id: 8,
    title: "Samosa",
    image: assets.samosa || "https://via.placeholder.com/300x200",
    time: "35 mins",
    difficulty: "Medium",
    rating: 4.5,
    category: "Snacks"
  },
  {
    id: 9,
    title: "Rajma Chawal",
    image: assets.rajma || "https://via.placeholder.com/300x200",
    time: "40 mins",
    difficulty: "Easy",
    rating: 4.6,
    category: "Indian"
  }
];

const ExplorePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [displayedRecipes, setDisplayedRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 6;

  // Load initial recipes
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRecipes(sampleRecipes);
      setFilteredRecipes(sampleRecipes);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter recipes based on search and category
  useEffect(() => {
    let filtered = recipes;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(recipe =>
        recipe.category === selectedCategory
      );
    }

    setFilteredRecipes(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory, recipes]);

  // Update displayed recipes based on pagination
  useEffect(() => {
    const indexOfLastRecipe = currentPage * recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
    setDisplayedRecipes(filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe));
  }, [filteredRecipes, currentPage]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const hasMoreRecipes = displayedRecipes.length < filteredRecipes.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center 
                         bg-gradient-to-r from-purple-600 to-pink-600 
                         bg-clip-text text-transparent mb-4">
            Explore Recipes
          </h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Discover delicious recipes from around the world. Search, filter, and find your next favorite meal!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        
        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          <SearchBar onSearch={handleSearch} />
          <CategoryFilters 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {displayedRecipes.length} of {filteredRecipes.length} recipes
          </p>
          {selectedCategory !== "All" && (
            <button
              onClick={() => handleCategoryChange("All")}
              className="text-purple-600 hover:text-purple-700 font-medium
                       transition-colors duration-300"
            >
              Clear Filters ✕
            </button>
          )}
        </div>

        {/* Recipe Grid */}
        <RecipeGrid 
          recipes={displayedRecipes}
          isLoading={isLoading}
        />

        {/* Load More Button */}
        {!isLoading && hasMoreRecipes && (
          <div className="mt-12 flex justify-center">
            <LoadMoreButton onLoadMore={handleLoadMore} />
          </div>
        )}

        {/* No Results Message */}
        {!isLoading && filteredRecipes.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No recipes found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ExplorePage;