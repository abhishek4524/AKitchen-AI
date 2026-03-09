import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReviewSection from "../components/ReviewSection";
import { motion, AnimatePresence } from "framer-motion";

const AIRecipe = () => {
  const [ingredients, setIngredients] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [diet, setDiet] = useState("");
  const [saved, setSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);

  // Sample recipes data
  const recipes = [
    {
      id: 1,
      title: "Paneer Butter Masala",
      time: "30 mins",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      cuisine: "Indian",
      difficulty: "Medium"
    },
    {
      id: 2,
      title: "Margherita Pizza",
      time: "20 mins",
      image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      cuisine: "Italian",
      difficulty: "Easy"
    },
    {
      id: 3,
      title: "Vegetable Stir Fry",
      time: "15 mins",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      cuisine: "Chinese",
      difficulty: "Easy"
    }
  ];

  const recipe = {
    title: "Paneer Tomato Masala",
    time: "25 minutes",
    servings: "2 servings",
    difficulty: "Easy",
    cuisine: "Indian",
    image: "https://as2.ftcdn.net/v2/jpg/07/38/73/03/1000_F_738730367_GeWP43o9ofUuSH63g5l5HuehCf9zWfQ1.jpg",
    ingredients: [
      "200g Paneer (cubed)",
      "2 Tomatoes (finely chopped)",
      "1 Onion (finely chopped)",
      "2 Garlic cloves (minced)",
      "1 tsp Cumin seeds",
      "1 tsp Turmeric powder",
      "1 tsp Red chili powder",
      "1 tsp Garam masala",
      "2 tbsp Oil",
      "Salt to taste",
      "Fresh coriander",
    ],
    steps: [
      "Heat oil in a pan and add cumin seeds",
      "Add onions and sauté until golden",
      "Add garlic and cook for a minute",
      "Add tomatoes and cook until soft",
      "Add spices and mix well",
      "Cook until oil separates",
      "Add paneer cubes and cook gently",
      "Garnish with fresh coriander and serve",
    ],
    nutrition: {
      calories: "320 kcal",
      protein: "12g",
      carbs: "15g",
      fat: "24g",
    },
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      setShowRecipe(true);
      console.log({ ingredients, cuisine, diet });
    }, 1500);
  };

  const RecipeCard = ({ recipe }) => (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
          ⏱ {recipe.time}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
        <div className="flex justify-between text-sm text-gray-600">
          <span>🍛 {recipe.cuisine}</span>
          <span>📊 {recipe.difficulty}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#feb7bb] to-[#ffd6d9]">
      <Navbar />

      {/* Hero Section with Background Images */}
      <div className="relative min-h-screen pt-24 overflow-hidden">
        {/* Left Background Image */}
        <div className="absolute left-0 top-1/4 w-64 h-64 opacity-20 hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt=""
            className="w-full h-full object-cover rounded-full blur-sm"
          />
        </div>

        {/* Right Background Image */}
        <div className="absolute right-0 bottom-1/4 w-80 h-80 opacity-20 hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt=""
            className="w-full h-full object-cover rounded-full blur-sm"
          />
        </div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text">
            What Can You Cook Today?
          </h1>
          <p className="text-gray-700 mt-6 text-lg md:text-xl max-w-2xl mx-auto">
            Type the ingredients you have and let AI create the perfect recipe
            for you in seconds.
          </p>
        </motion.div>

        {/* Generator Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 mt-12 px-4"
        >
          <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 w-full max-w-3xl mx-auto border border-white/20">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter ingredients.. (Example: Tomato, Onion, Paneer)"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl p-4 pr-12 text-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-300 outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
                🥘
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="flex-1 border-2 border-gray-200 p-3 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-300 outline-none bg-white"
              >
                <option value="">🌍 Select Cuisine</option>
                <option>Indian</option>
                <option>Italian</option>
                <option>Chinese</option>
                <option>Mexican</option>
                <option>Japanese</option>
                <option>Thai</option>
              </select>

              <select
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                className="flex-1 border-2 border-gray-200 p-3 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-300 outline-none bg-white"
              >
                <option value="">🥗 Select Diet</option>
                <option>Vegetarian</option>
                <option>Non-Veg</option>
                <option>Vegan</option>
                <option>Keto</option>
                <option>Gluten-Free</option>
              </select>
            </div>

            {/* Suggestions */}
            <div className="flex items-center gap-2 mt-6 flex-wrap">
              <span className="text-gray-500 font-medium">Try:</span>
              {["Paneer", "Pasta", "Chicken", "Egg", "Tofu", "Mushroom"].map((item, index) => (
                <motion.button
                  key={item}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIngredients(item)}
                  className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all duration-300 text-sm font-medium"
                >
                  🍳 {item}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                "🍳 Generate Recipe"
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Recipe Result */}
        <AnimatePresence>
          {showRecipe && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 mt-16 px-4 pb-16"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl mx-auto overflow-hidden">
                {/* Image Section */}
                <div className="relative h-96 overflow-hidden group">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  <div className="absolute bottom-8 left-8 text-white">
                    <motion.h2 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-5xl font-bold mb-3"
                    >
                      {recipe.title}
                    </motion.h2>
                    
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap gap-4 text-sm"
                    >
                      <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">⏱ {recipe.time}</span>
                      <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">🍽 {recipe.servings}</span>
                      <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">📊 {recipe.difficulty}</span>
                      <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">🍛 {recipe.cuisine}</span>
                    </motion.div>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {/* Nutrition Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(recipe.nutrition).map(([key, value], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl text-center"
                      >
                        <p className="text-gray-500 text-sm capitalize">{key}</p>
                        <p className="font-bold text-lg text-purple-600">{value}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Ingredients + Instructions */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="font-bold text-2xl mb-4 flex items-center gap-2">
                        <span>🛒</span> Ingredients
                      </h3>
                      <div className="space-y-2">
                        {recipe.ingredients.map((item, i) => (
                          <motion.label
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * i }}
                            className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition-colors duration-300 cursor-pointer group"
                          >
                            <input 
                              type="checkbox" 
                              className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 transition-all duration-300 group-hover:scale-110"
                            />
                            <span className="text-gray-700">{item}</span>
                          </motion.label>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="font-bold text-2xl mb-4 flex items-center gap-2">
                        <span>📝</span> Instructions
                      </h3>
                      <div className="space-y-3">
                        {recipe.steps.map((step, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * i }}
                            className="flex gap-3 bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                          >
                            <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {i + 1}
                            </div>
                            <p className="text-gray-700">{step}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSaved(!saved)}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        saved 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      {saved ? '❤️ Saved' : '❤️ Save Recipe'}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold transition-all duration-300"
                    >
                      🛒 Add to Grocery
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300"
                    >
                      📤 Share
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Similar Recipes Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 w-full flex flex-col items-center mt-24 px-4 pb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            You Might Also Like
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {recipes.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </motion.div>
      </div>

      <ReviewSection />
      <Footer />
    </div>
  );
};

export default AIRecipe;