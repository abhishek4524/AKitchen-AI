import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { assets } from "../assets/assets";
import {
  Sparkles,
  ShoppingCart,
  Calendar,
  ChefHat,
  Clock,
  Bookmark,
  Trash2,
  Circle,
  Plus,
  Heart,
  ArrowRight,
  Salad,
  Pizza,
  UtensilsCrossed,
  ListChecks,
  CheckCircle2,
  User,
  Search,
  Menu,
  X,
  Home,
  Compass,
  ShoppingBag,
  Info,
  LogOut,
  Settings,
  Bell
} from "lucide-react";

// ==================== Custom Animations (matching ExplorePage) ====================
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  @keyframes float-delayed {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
  }
  .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
  .animate-fadeInDown { animation: fadeInDown 0.6s ease-out forwards; }
  .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
  .animate-slideUp { animation: slideUp 0.5s ease-out forwards; }
  .animate-float { animation: float 3s ease-in-out infinite; }
  .animate-float-delayed { animation: float-delayed 3.5s ease-in-out infinite; }
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .delay-400 { animation-delay: 0.4s; }
  .delay-500 { animation-delay: 0.5s; }
`;

// Mock user data – in a real app, this would come from context/auth
const currentUser = { name: "Abhishek" };

// Mock recipe data with proper IDs
const recentRecipesData = [
  {
    id: 101,
    name: "Paneer Tomato Masala",
    time: "30 mins",
    difficulty: "Medium",
    image: assets.paneer || "https://images.unsplash.com/photo-1631458264863-6c6c9b3a1e4e?w=300&h=200&fit=crop"
  },
  {
    id: 102,
    name: "Veg Fried Rice",
    time: "20 mins",
    difficulty: "Easy",
    image: assets.friedRice || "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&h=200&fit=crop"
  },
  {
    id: 103,
    name: "Spicy Garlic Pasta",
    time: "25 mins",
    difficulty: "Medium",
    image: assets.pasta || "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=200&fit=crop"
  }
];

const savedRecipesInitial = [
  { id: 201, name: "Butter Chicken", image: assets.chicken || "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=100&h=100&fit=crop" },
  { id: 202, name: "Masala Pasta", image: assets.pasta || "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=100&h=100&fit=crop" },
  { id: 203, name: "Veg Biryani", image: assets.biryani || "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100&h=100&fit=crop" }
];

const recommendedData = [
  {
    id: 301,
    name: "Garlic Butter Chicken",
    image: assets.chicken || "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop"
  },
  {
    id: 302,
    name: "Paneer Tikka",
    image: assets.paneer || "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop"
  },
  {
    id: 303,
    name: "Masala Omelette",
    image: assets.omelette || "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=300&h=200&fit=crop"
  }
];

const activities = [
  { icon: Sparkles, text: "Generated recipe: Paneer Tomato Masala", time: "2h ago", color: "text-purple-500" },
  { icon: ShoppingCart, text: "Added Paneer to grocery list", time: "5h ago", color: "text-green-500" },
  { icon: Bookmark, text: "Saved recipe: Spicy Garlic Pasta", time: "1d ago", color: "text-orange-500" },
  { icon: Heart, text: "Liked recipe: Veg Biryani", time: "2d ago", color: "text-red-500" }
];

// ==================== Hero Section (purple themed) ====================
const DashboardHero = () => {
  const navigate = useNavigate();

  const buttons = [
    { icon: Sparkles, label: "Generate AI Recipe", color: "bg-purple-600 hover:bg-purple-700", delay: "delay-100", path: "/generate" },
    { icon: ShoppingCart, label: "View Grocery List", color: "bg-green-500 hover:bg-green-600", delay: "delay-200", path: "/grocery" },
    { icon: Calendar, label: "Plan Meals", color: "bg-orange-500 hover:bg-orange-600", delay: "delay-300", path: "/meal-planner" }
  ];

  return (
    <div className="relative bg-gradient-to-br from-purple-200 via-purple-100 to-purple-50 overflow-hidden py-24">
      {/* Floating food icons */}
      <div className="absolute top-4 right-12 text-purple-300/50 animate-float">
        <Pizza size={48} />
      </div>
      <div className="absolute bottom-4 left-12 text-purple-300/50 animate-float-delayed">
        <Salad size={48} />
      </div>
      <div className="absolute top-1/2 left-1/3 text-purple-300/30 animate-float" style={{ animationDelay: "2s" }}>
        <UtensilsCrossed size={64} />
      </div>

      <div className="relative z-10 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-2 animate-fadeInDown">
          Hello {currentUser.name}!
        </h1>
        <p className="text-2xl text-gray-600 mb-8 animate-fadeInUp delay-100">
          Ready to cook something amazing today?
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => navigate(btn.path)}
              className={`group relative ${btn.color} text-white px-8 py-4 rounded-xl flex items-center space-x-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden ${btn.delay} animate-fadeInUp cursor-pointer`}
            >
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></span>
              <btn.icon className="w-5 h-5 relative z-10" />
              <span className="relative z-10 font-medium">{btn.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==================== Stats Cards ====================
const StatsCards = () => {
  // In a real app, these values would come from an API/context
  const stats = [
    { icon: Sparkles, label: "Recipes Generated", value: "24", color: "text-purple-600", bg: "bg-purple-100", delay: "delay-100" },
    { icon: Bookmark, label: "Saved Recipes", value: savedRecipesInitial.length.toString(), color: "text-green-600", bg: "bg-green-100", delay: "delay-200" },
    { icon: ShoppingCart, label: "Grocery Items", value: "18", color: "text-orange-600", bg: "bg-orange-100", delay: "delay-300" },
    { icon: Calendar, label: "Meal Plans", value: "3", color: "text-blue-600", bg: "bg-blue-100", delay: "delay-400" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-purple-200 animate-slideUp ${stat.delay} cursor-default`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
          </div>
          <p className="mt-2 text-gray-600 font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

// ==================== Recent Recipes ====================
const RecentRecipes = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-200 animate-slideUp">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent AI Recipes</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentRecipesData.map((recipe, idx) => (
          <div
            key={recipe.id}
            className="group bg-gradient-to-br from-purple-50 to-white rounded-xl p-3 hover:bg-purple-100 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="relative overflow-hidden rounded-lg mb-3">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h3 className="font-semibold text-gray-800">{recipe.name}</h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Clock className="w-4 h-4 mr-1" />
              <span className="mr-3">{recipe.time}</span>
              <ChefHat className="w-4 h-4 mr-1" />
              <span>{recipe.difficulty}</span>
            </div>
            <div className="flex justify-between mt-3">
              <button
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center group/btn cursor-pointer"
              >
                View Recipe
                <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => alert(`Saved ${recipe.name} (demo)`)}
                className="text-gray-600 hover:text-purple-600 text-sm font-medium flex items-center cursor-pointer"
              >
                <Bookmark className="w-4 h-4 mr-1" />
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== Saved Recipes ====================
const SavedRecipes = () => {
  const navigate = useNavigate();
  const [savedRecipes, setSavedRecipes] = useState(savedRecipesInitial);

  const handleRemove = (id) => {
    setSavedRecipes(prev => prev.filter(recipe => recipe.id !== id));
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-200 animate-slideUp delay-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Saved Recipes</h2>
      <div className="space-y-4">
        {savedRecipes.map((recipe, idx) => (
          <div
            key={recipe.id}
            className="group flex items-center justify-between hover:bg-purple-50 p-2 rounded-xl transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-12 h-12 rounded-lg object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <span className="font-medium text-gray-700">{recipe.name}</span>
            </div>
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                className="text-sm text-green-600 hover:text-green-700 px-2 py-1 rounded hover:bg-green-50 transition-colors cursor-pointer"
              >
                Cook Again
              </button>
              <button
                onClick={() => handleRemove(recipe.id)}
                className="text-sm text-red-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {savedRecipes.length > 3 && (
        <button
          onClick={() => navigate("/saved")}
          className="mt-4 text-purple-600 hover:text-purple-700 font-medium flex items-center group cursor-pointer"
        >
          +{savedRecipes.length - 3} more items
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
};

// ==================== Grocery Summary ====================
const GrocerySummary = () => {
  const navigate = useNavigate();
  const [items] = useState(["Paneer", "Tomatoes", "Onions", "Garlic", "Ginger", "Salt", "Oil"]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-200 animate-slideUp delay-300">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Grocery List Summary</h2>
      <div className="space-y-3">
        {items.slice(0, 5).map((item, idx) => (
          <div key={idx} className="flex items-center justify-between group hover:bg-purple-50 p-1 rounded-lg transition-colors">
            <div className="flex items-center space-x-2">
              <Circle className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
              <span className="text-gray-700">{item}</span>
            </div>
            <span className="text-sm text-gray-500">
              {idx === 0 ? "1 pack" : idx === 1 ? "1 kg" : "2 pcs"}
            </span>
          </div>
        ))}
        {items.length > 5 && (
          <div
            onClick={() => navigate("/grocery")}
            className="flex items-center space-x-2 text-gray-500 hover:text-purple-600 cursor-pointer transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>{items.length - 5} more items</span>
          </div>
        )}
      </div>
      <button
        onClick={() => navigate("/grocery")}
        className="mt-4 w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-2 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer"
      >
        Open Grocery Page
      </button>
    </div>
  );
};

// ==================== Meal Planner ====================
const MealPlanner = () => {
  const navigate = useNavigate();
  const meals = [
    { day: "Monday", meal: "Paneer Curry", image: assets.paneer || "https://images.unsplash.com/photo-1631458264863-6c6c9b3a1e4e?w=50&h=50&fit=crop" },
    { day: "Tuesday", meal: "Pasta", image: assets.pasta || "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=50&h=50&fit=crop" }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-200 animate-slideUp delay-400">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Meal Planner</h2>
      <div className="space-y-4">
        {meals.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-purple-50/80 p-2 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer"
            onClick={() => navigate("/meal-planner")}
          >
            <div className="flex items-center space-x-3">
              <img src={item.image} alt={item.meal} className="w-10 h-10 rounded-lg object-cover" />
              <div>
                <p className="text-sm text-gray-500">{item.day}</p>
                <p className="font-medium text-gray-800">{item.meal}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate("/meal-planner")}
        className="mt-4 w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-2 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md flex items-center justify-center cursor-pointer"
      >
        <Calendar className="w-4 h-4 mr-2" />
        Generate Weekly Plan
      </button>
    </div>
  );
};

// ==================== Activity History ====================
const ActivityHistory = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-200 animate-slideUp">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Activity History</h2>
      <div className="space-y-4">
        {activities.map((act, idx) => (
          <div
            key={idx}
            className="flex items-start space-x-3 group hover:bg-purple-50 p-2 rounded-xl transition-colors cursor-pointer"
            onClick={() => navigate("/history")}
          >
            <div className={`p-2 rounded-full bg-purple-50 group-hover:scale-110 transition-transform ${act.color}`}>
              <act.icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-gray-700">{act.text}</p>
              <p className="text-xs text-gray-400">{act.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== AI Recommendations ====================
const AIRecommendations = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-200 animate-slideUp delay-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">AI Recommended for You</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendedData.map((recipe, idx) => (
          <div
            key={recipe.id}
            className="group bg-gradient-to-br from-purple-50 to-white rounded-xl p-3 hover:scale-105 transition-all duration-300 hover:shadow-xl"
          >
            <div className="relative overflow-hidden rounded-lg mb-3">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">{recipe.name}</h3>
            <button
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg flex items-center justify-center group/btn cursor-pointer"
            >
              <Heart className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
              Try Recipe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== Main Dashboard ====================
const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
      <style>{animationStyles}</style>
      <Navbar />
      <DashboardHero />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-12 space-y-8">
        <StatsCards />

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            <RecentRecipes />
            <ActivityHistory />
            <AIRecommendations />
          </div>

          {/* Right column (1/3) */}
          <div className="space-y-8">
            <SavedRecipes />
            <GrocerySummary />
            <MealPlanner />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;