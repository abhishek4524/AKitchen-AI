import React, { useState } from "react";

const RecipeResult = () => {
    const [saved, setSaved] = useState(false);
    const [groceryAdded, setGroceryAdded] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);
    
    const recipe = {
        title: "Paneer Tomato Masala",
        time: "25 minutes",
        servings: "2 servings",
        difficulty: "Easy",
        cuisine: "Indian",
        image: "https://as2.ftcdn.net/v2/jpg/07/38/73/03/1000_F_738730367_GeWP43o9ofUuSH63g5l5HuehCf9zWfQ1.jpg", // Add actual image URL
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
            "Fresh coriander for garnish"
        ],
        steps: [
            "Heat oil in a pan, add cumin seeds and let them splutter",
            "Add chopped onions and sauté until golden brown",
            "Add minced garlic and sauté for another minute",
            "Add chopped tomatoes and cook until soft and mushy",
            "Add all spices (turmeric, red chili, garam masala, salt) and mix well",
            "Cook the masala until oil separates from the mixture",
            "Add paneer cubes and gently mix, cook for 5-7 minutes",
            "Garnish with fresh coriander and serve hot"
        ],
        nutrition: {
            calories: "320 kcal",
            protein: "12g",
            carbs: "15g",
            fat: "24g"
        }
    };

    if (!recipe) return null;

    const handleSave = () => {
        setSaved(!saved);
        // Add your save logic here
    };

    const handleGrocery = () => {
        setGroceryAdded(true);
        // Add your grocery list logic here
        setTimeout(() => setGroceryAdded(false), 2000);
    };

    const handleShare = (platform) => {
        // Add your share logic here
        console.log(`Sharing to ${platform}`);
        setShowShareOptions(false);
    };

    return (
        <div className="w-full flex justify-center mt-12 px-4">
            <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-4xl
                          transform transition-all duration-500 hover:shadow-3xl
                          animate-fadeIn">
                
                {/* Recipe Image with Gradient Overlay */}
                <div className="relative h-64 md:h-80 overflow-hidden">
                    <img 
                        src={recipe.image} 
                        alt={recipe.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    
                    {/* Title on Image for Mobile/Tablet */}
                    <div className="absolute bottom-6 left-6 text-white">
                        <h2 className="text-4xl md:text-5xl font-bold mb-2">{recipe.title}</h2>
                        <div className="flex flex-wrap gap-4 text-sm md:text-base">
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                ⏱ {recipe.time}
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                🍽 {recipe.servings}
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                📊 {recipe.difficulty}
                            </span>
                            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                🍛 {recipe.cuisine}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Recipe Content */}
                <div className="p-6 md:p-8">
                    
                    {/* Quick Info Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {Object.entries(recipe.nutrition).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 rounded-xl p-4 text-center
                                                      transform transition-all duration-300 hover:scale-105
                                                      hover:shadow-md border border-gray-100">
                                <p className="text-sm text-gray-500 capitalize mb-1">{key}</p>
                                <p className="text-lg font-bold text-gray-800">{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Ingredients Section */}
                    <div className="mb-8 animate-slideIn">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🛒</span>
                            <h3 className="text-2xl font-bold text-gray-800">Ingredients</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {recipe.ingredients.map((item, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl
                                             transform transition-all duration-300 hover:translate-x-2
                                             hover:bg-purple-50 group cursor-pointer"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 rounded border-gray-300 text-purple-600 
                                                   focus:ring-purple-500 transition-colors"
                                    />
                                    <span className="text-gray-700 group-hover:text-gray-900">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Instructions Section */}
                    <div className="mb-8 animate-slideIn" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">📝</span>
                            <h3 className="text-2xl font-bold text-gray-800">Instructions</h3>
                        </div>
                        
                        <div className="space-y-4">
                            {recipe.steps.map((step, index) => (
                                <div 
                                    key={index}
                                    className="flex gap-4 p-4 bg-gray-50 rounded-xl
                                             transform transition-all duration-300 hover:scale-[1.02]
                                             hover:bg-blue-50 group"
                                >
                                    <span className="flex items-center justify-center w-8 h-8 
                                                     bg-purple-600 text-white rounded-full 
                                                     font-bold text-sm group-hover:bg-purple-700
                                                     transition-colors">
                                        {index + 1}
                                    </span>
                                    <p className="text-gray-700 group-hover:text-gray-900 flex-1">
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons with Enhanced Interactions */}
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                        
                        <button 
                            onClick={handleSave}
                            className={`flex-1 min-w-[140px] px-6 py-3 rounded-xl font-semibold
                                     transform transition-all duration-300 hover:scale-105
                                     hover:shadow-lg active:scale-95
                                     ${saved 
                                         ? 'bg-red-500 hover:bg-red-600 text-white' 
                                         : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        >
                            <span className="mr-2">{saved ? '❤️' : '🤍'}</span>
                            {saved ? 'Saved' : 'Save Recipe'}
                        </button>

                        <button 
                            onClick={handleGrocery}
                            className="flex-1 min-w-[140px] bg-green-500 hover:bg-green-600 
                                     text-white px-6 py-3 rounded-xl font-semibold
                                     transform transition-all duration-300 hover:scale-105
                                     hover:shadow-lg active:scale-95 relative overflow-hidden"
                        >
                            <span className="mr-2">🛒</span>
                            Add to Grocery
                            {groceryAdded && (
                                <span className="absolute inset-0 bg-green-400 
                                                 animate-pulse flex items-center justify-center">
                                    ✓ Added!
                                </span>
                            )}
                        </button>

                        <div className="relative flex-1 min-w-[140px]">
                            <button 
                                onClick={() => setShowShareOptions(!showShareOptions)}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white 
                                         px-6 py-3 rounded-xl font-semibold
                                         transform transition-all duration-300 hover:scale-105
                                         hover:shadow-lg active:scale-95"
                            >
                                <span className="mr-2">📤</span>
                                Share
                            </button>

                            {/* Share Options Dropdown */}
                            {showShareOptions && (
                                <div className="absolute top-full left-0 right-0 mt-2 
                                              bg-white rounded-xl shadow-xl overflow-hidden
                                              animate-slideDown z-10">
                                    {['WhatsApp', 'Facebook', 'Twitter', 'Copy Link'].map((platform) => (
                                        <button
                                            key={platform}
                                            onClick={() => handleShare(platform)}
                                            className="w-full px-4 py-3 text-left hover:bg-gray-50
                                                     transition-colors duration-200
                                                     border-b last:border-b-0"
                                        >
                                            {platform}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Print/Download Button */}
                    <div className="mt-4 flex justify-end">
                        <button className="text-gray-500 hover:text-purple-600 
                                         transition-colors duration-300 text-sm
                                         flex items-center gap-2">
                            <span>📥</span>
                            Download Recipe
                        </button>
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out forwards;
                }

                .animate-slideIn {
                    animation: slideIn 0.6s ease-out forwards;
                    opacity: 0;
                }

                .animate-slideDown {
                    animation: slideDown 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default RecipeResult;