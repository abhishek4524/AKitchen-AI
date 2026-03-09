import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { assets } from "../assets/assets";

// Expanded recipe database with more items
const allRecipes = [
  // Trending Recipes
  {
    id: 1,
    title: "Paneer Butter Masala",
    img: assets.paneer,
    time: "30 min",
    rating: 4.8,
    cuisine: "Indian",
    difficulty: "Medium",
    category: "trending",
    ingredients: ["Paneer", "Butter", "Cream", "Spices"],
    description: "Creamy and rich paneer curry in tomato gravy"
  },
  {
    id: 2,
    title: "Veg Biryani",
    img: assets.biryani,
    time: "45 min",
    rating: 4.7,
    cuisine: "Indian",
    difficulty: "Hard",
    category: "trending",
    ingredients: ["Rice", "Mixed Vegetables", "Spices", "Yogurt"],
    description: "Fragrant rice dish layered with vegetables and spices"
  },
  {
    id: 3,
    title: "Creamy Alfredo Pasta",
    img: assets.pasta,
    time: "25 min",
    rating: 4.5,
    cuisine: "Italian",
    difficulty: "Easy",
    category: "trending",
    ingredients: ["Pasta", "Cream", "Parmesan", "Garlic"],
    description: "Rich and creamy white sauce pasta"
  },
  {
    id: 4,
    title: "Chicken Curry",
    img: assets.chicken,
    time: "40 min",
    rating: 4.8,
    cuisine: "Indian",
    difficulty: "Medium",
    category: "trending",
    ingredients: ["Chicken", "Onions", "Tomatoes", "Spices"],
    description: "Classic Indian chicken curry with aromatic spices"
  },
  
  // AI Generated Recipes
  {
    id: 5,
    title: "Spicy Garlic Paneer",
    img: assets.paneer,
    time: "20 min",
    rating: 4.6,
    cuisine: "Indian",
    difficulty: "Easy",
    category: "aiGenerated",
    ingredients: ["Paneer", "Garlic", "Red Chili", "Spices"],
    description: "Quick and spicy paneer stir-fry"
  },
  {
    id: 6,
    title: "Veggie Egg Fried Rice",
    img: assets.friedRice,
    time: "25 min",
    rating: 4.4,
    cuisine: "Chinese",
    difficulty: "Easy",
    category: "aiGenerated",
    ingredients: ["Rice", "Eggs", "Mixed Vegetables", "Soy Sauce"],
    description: "Perfect fusion of Indo-Chinese flavors"
  },
  {
    id: 7,
    title: "Tomato Basil Pasta",
    img: assets.pasta,
    time: "20 min",
    rating: 4.5,
    cuisine: "Italian",
    difficulty: "Easy",
    category: "aiGenerated",
    ingredients: ["Pasta", "Tomatoes", "Fresh Basil", "Olive Oil"],
    description: "Simple and fresh Italian pasta"
  },
  {
    id: 8,
    title: "Cheesy Masala Omelette",
    img: assets.omelette,
    time: "15 min",
    rating: 4.3,
    cuisine: "Fusion",
    difficulty: "Easy",
    category: "aiGenerated",
    ingredients: ["Eggs", "Cheese", "Onions", "Indian Spices"],
    description: "Indian-style spicy omelette with cheese"
  },
  
  // Most Cooked Recipes
  {
    id: 9,
    title: "Chicken Tikka",
    img: assets.chicken,
    time: "35 min",
    rating: 4.9,
    cuisine: "Indian",
    difficulty: "Medium",
    category: "mostCooked",
    ingredients: ["Chicken", "Yogurt", "Tikka Masala", "Spices"],
    description: "Tandoori-style grilled chicken pieces"
  },
  {
    id: 10,
    title: "Veg Pizza",
    img: assets.pizza,
    time: "30 min",
    rating: 4.7,
    cuisine: "Italian",
    difficulty: "Medium",
    category: "mostCooked",
    ingredients: ["Pizza Base", "Cheese", "Vegetables", "Pizza Sauce"],
    description: "Loaded vegetable pizza with mozzarella"
  },
  {
    id: 11,
    title: "Avocado Salad",
    img: assets.salad,
    time: "10 min",
    rating: 4.5,
    cuisine: "Healthy",
    difficulty: "Easy",
    category: "mostCooked",
    ingredients: ["Avocado", "Lettuce", "Cherry Tomatoes", "Olive Oil"],
    description: "Fresh and healthy avocado salad"
  },
  {
    id: 12,
    title: "Creamy Mushroom Pasta",
    img: assets.pasta,
    time: "25 min",
    rating: 4.6,
    cuisine: "Italian",
    difficulty: "Medium",
    category: "mostCooked",
    ingredients: ["Pasta", "Mushrooms", "Cream", "Garlic"],
    description: "Rich mushroom pasta in creamy sauce"
  },
  
  // Additional Recipes for Load More
  {
    id: 13,
    title: "Butter Chicken",
    img: assets.chicken,
    time: "45 min",
    rating: 4.9,
    cuisine: "Indian",
    difficulty: "Medium",
    category: "additional",
    ingredients: ["Chicken", "Butter", "Cream", "Spices"],
    description: "Famous Indian butter chicken"
  },
  {
    id: 14,
    title: "Masala Dosa",
    img: assets.biryani,
    time: "30 min",
    rating: 4.7,
    cuisine: "Indian",
    difficulty: "Hard",
    category: "additional",
    ingredients: ["Rice", "Lentils", "Potatoes", "Spices"],
    description: "Crispy dosa with spiced potato filling"
  },
  {
    id: 15,
    title: "Chocolate Brownie",
    img: assets.pasta,
    time: "35 min",
    rating: 4.8,
    cuisine: "Desserts",
    difficulty: "Medium",
    category: "additional",
    ingredients: ["Chocolate", "Flour", "Eggs", "Sugar"],
    description: "Fudgy chocolate brownies"
  },
  {
    id: 16,
    title: "Mango Smoothie",
    img: assets.salad,
    time: "5 min",
    rating: 4.5,
    cuisine: "Drinks",
    difficulty: "Easy",
    category: "additional",
    ingredients: ["Mango", "Yogurt", "Honey", "Ice"],
    description: "Refreshing mango smoothie"
  }
];

const categories = [
  { name: "All", icon: "🍽️", count: allRecipes.length },
  { name: "Indian", icon: "🍛", count: allRecipes.filter(r => r.cuisine === "Indian").length },
  { name: "Italian", icon: "🍝", count: allRecipes.filter(r => r.cuisine === "Italian").length },
  { name: "Healthy", icon: "🥗", count: allRecipes.filter(r => r.cuisine === "Healthy").length },
  { name: "Vegan", icon: "🌱", count: allRecipes.filter(r => r.difficulty === "Easy" && r.cuisine !== "Non-Veg").length },
  { name: "Quick & Easy", icon: "⚡", count: allRecipes.filter(r => r.difficulty === "Easy").length },
  { name: "Drinks", icon: "🥤", count: allRecipes.filter(r => r.cuisine === "Drinks").length },
  { name: "Desserts", icon: "🍰", count: allRecipes.filter(r => r.cuisine === "Desserts").length }
];

const RecipeCard = ({ recipe, index, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group animate-fadeIn cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onQuickView(recipe)}
    >
      <div className="overflow-hidden h-52">
        <img
          src={recipe.img}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          alt={recipe.title}
          loading="lazy"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90"></div>

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform transition-transform duration-300">
        <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-purple-200 transition-colors">
          {recipe.title}
        </h3>

        <div className="flex items-center gap-3 text-sm mb-2">
          <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
            {recipe.cuisine}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            recipe.difficulty === 'Easy' ? 'bg-green-500/30' :
            recipe.difficulty === 'Medium' ? 'bg-yellow-500/30' :
            'bg-red-500/30'
          } backdrop-blur-sm`}>
            {recipe.difficulty}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1">
              <span className="text-yellow-300">⏱️</span> {recipe.time}
            </span>
            <span className="flex items-center gap-1">
              <span className="text-yellow-300">⭐</span> {recipe.rating}
            </span>
          </div>

          <button
            className={`bg-white text-purple-600 px-3 py-1 rounded-full text-xs font-semibold transform transition-all duration-300 ${
              isHovered ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            } hover:bg-purple-600 hover:text-white`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(recipe);
            }}
          >
            Quick View
          </button>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, recipes, viewAllLink, onViewAll, onQuickView }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedRecipes = showAll ? recipes : recipes.slice(0, 4);

  return (
    <div className="mt-16 animate-slideUp">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          {title}
        </h2>
        {recipes.length > 4 && (
          <button 
            className="group flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-300"
            onClick={() => setShowAll(!showAll)}
          >
            <span>{showAll ? 'Show Less' : 'View All'}</span>
            <span className={`transform transition-transform duration-300 ${
              showAll ? 'rotate-180' : 'group-hover:translate-x-1'
            }`}>
              {showAll ? '↑' : '→'}
            </span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedRecipes.map((recipe, index) => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            index={index}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </div>
  );
};

// Quick View Modal Component
const QuickViewModal = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        <div className="relative">
          <img 
            src={recipe.img} 
            alt={recipe.title}
            className="w-full h-64 object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
          
          <div className="flex gap-4 mb-4">
            <span className="flex items-center gap-1 bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
              ⏱️ {recipe.time}
            </span>
            <span className="flex items-center gap-1 bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full">
              ⭐ {recipe.rating}
            </span>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              {recipe.cuisine}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">{recipe.description}</p>
          
          <h3 className="font-semibold mb-2">Ingredients:</h3>
          <ul className="list-disc list-inside mb-4 text-gray-600">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
          
          <button className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold">
            View Full Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

const ExplorePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [displayCount, setDisplayCount] = useState(12);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState(allRecipes);

  // Filter recipes based on search and category
  useEffect(() => {
    let filtered = allRecipes;

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(recipe => 
        recipe.cuisine === selectedCategory || 
        (selectedCategory === "Quick & Easy" && recipe.difficulty === "Easy") ||
        (selectedCategory === "Vegan" && !recipe.ingredients?.some(i => 
          i.toLowerCase().includes('chicken') || 
          i.toLowerCase().includes('egg') || 
          i.toLowerCase().includes('paneer')
        ))
      );
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(term) ||
        recipe.cuisine.toLowerCase().includes(term) ||
        recipe.ingredients?.some(i => i.toLowerCase().includes(term)) ||
        recipe.description?.toLowerCase().includes(term)
      );
    }

    setFilteredRecipes(filtered);
  }, [selectedCategory, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by useEffect
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 8);
  };

  const handleViewAll = (category) => {
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getRecipesByCategory = (category) => {
    return filteredRecipes.filter(r => r.category === category).slice(0, 4);
  };

  const trendingRecipes = getRecipesByCategory("trending");
  const aiGeneratedRecipes = getRecipesByCategory("aiGenerated");
  const mostCookedRecipes = getRecipesByCategory("mostCooked");

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />

      {/* Quick View Modal */}
      {selectedRecipe && (
        <QuickViewModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
        />
      )}

      {/* HERO SECTION */}
      <div className="relative bg-gradient-to-r from-purple-200 to-purple-100 py-20 overflow-hidden">
        {/* Background images */}
        <div className="absolute left-0 top-0 w-64 h-full opacity-10">
          <img
            src={assets.paneer}
            alt=""
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
        </div>
        <div className="absolute right-0 top-0 w-64 h-full opacity-10">
          <img
            src={assets.biryani}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Floating icons */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 animate-float">
            <span className="text-4xl opacity-20">🍜</span>
          </div>
          <div className="absolute bottom-10 right-1/4 animate-float-delayed">
            <span className="text-4xl opacity-20">🍛</span>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 text-center z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fadeInDown">
            Explore <span className="text-purple-600">Recipes</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto animate-fadeInUp">
            Discover {filteredRecipes.length} delicious recipes created by AI and our community
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex items-center bg-white shadow-xl rounded-full overflow-hidden max-w-2xl mx-auto transform hover:scale-105 transition-transform duration-300 animate-fadeIn">
            <input
              type="text"
              placeholder="Search recipes, ingredients, cuisines..."
              className="flex-1 px-6 py-4 outline-none text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-purple-600 text-white px-8 py-4 font-semibold hover:bg-purple-700 transition-colors duration-300 flex items-center gap-2"
            >
              <span>🔍</span>
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Search Results Count */}
          {searchTerm && (
            <p className="mt-4 text-gray-600 animate-fadeIn">
              Found {filteredRecipes.length} recipes matching "{searchTerm}"
            </p>
          )}

          {/* Category Filters */}
          <div className="flex justify-center gap-3 flex-wrap mt-8 px-4 animate-fadeInUp">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-full shadow-sm transition-all duration-300 transform hover:-translate-y-1 ${
                  selectedCategory === cat.name
                    ? "bg-purple-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 hover:shadow"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {cat.count}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="white"
              fillOpacity="1"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-4 pb-20 relative z-10">
        {filteredRecipes.length > 0 ? (
          <>
            {selectedCategory === "All" && searchTerm === "" ? (
              // Show all sections when no filters are applied
              <>
                {trendingRecipes.length > 0 && (
                  <Section 
                    title="🔥 Trending Recipes" 
                    recipes={trendingRecipes}
                    onViewAll={() => handleViewAll("Indian")}
                    onQuickView={setSelectedRecipe}
                  />
                )}
                
                {aiGeneratedRecipes.length > 0 && (
                  <Section 
                    title="✨ Recently Generated by AI" 
                    recipes={aiGeneratedRecipes}
                    onViewAll={() => handleViewAll("Italian")}
                    onQuickView={setSelectedRecipe}
                  />
                )}
                
                {mostCookedRecipes.length > 0 && (
                  <Section 
                    title="👨‍🍳 Most Cooked This Week" 
                    recipes={mostCookedRecipes}
                    onViewAll={() => handleViewAll("Healthy")}
                    onQuickView={setSelectedRecipe}
                  />
                )}
              </>
            ) : (
              // Show filtered results
              <div className="mt-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                  {searchTerm ? `Search Results for "${searchTerm}"` : `${selectedCategory} Recipes`}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredRecipes.slice(0, displayCount).map((recipe, index) => (
                    <RecipeCard 
                      key={recipe.id} 
                      recipe={recipe} 
                      index={index}
                      onQuickView={setSelectedRecipe}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Load More Button */}
            {filteredRecipes.length > displayCount && (
              <div className="flex justify-center mt-16">
                <button 
                  onClick={handleLoadMore}
                  className="group bg-black text-white px-8 py-4 rounded-full hover:bg-purple-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center gap-3"
                >
                  <span className="font-semibold">Load More Recipes</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            )}
          </>
        ) : (
          // No results found
          <div className="text-center py-16 animate-fadeIn">
            <span className="text-6xl mb-4 block">😕</span>
            <h3 className="text-2xl font-bold mb-2">No Recipes Found</h3>
            <p className="text-gray-600 mb-6">We couldn't find any recipes matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

// Styles remain the same as before
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  @keyframes float-delayed {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }

  .animate-fadeInDown {
    animation: fadeInDown 0.6s ease-out forwards;
  }

  .animate-fadeInUp {
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .animate-slideUp {
    animation: slideUp 0.5s ease-out forwards;
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-float-delayed {
    animation: float-delayed 3.5s ease-in-out infinite;
  }
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

export default ExplorePage;