import React, { useState, useEffect } from "react";
import { 
  CalendarDays, 
  Clock, 
  Plus, 
  ShoppingCart, 
  BookOpen, 
  Download,
  Sparkles,
  ChefHat,
  Heart,
  Share2,
  Printer,
  Sun,
  Moon,
  Cloud,
  AlertCircle,
  Check,
  X,
  Edit2,
  Trash2,
  Copy,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Users,
  Utensils,
  Award,
  TrendingUp,
  Filter,
  Search,
  Leaf,
  Flame,
  Wheat,
  Milk,
  Egg,
  Apple,
  Coffee
} from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useInView } from 'react-intersection-observer';

// Color theme
const colors = {
  lavender: '#CBB9DF',
  sunflower: '#fed348',
  lavenderLight: '#E6D9F0',
  lavenderDark: '#B299CC',
  sunflowerLight: '#FFE9A3',
  sunflowerDark: '#F5C518'
};

const Fish = (props) => (
<svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <path d="M2 12s2-6 10-6 10 6 10 6-2 6-10 6-10-6-10-6z" />
  <circle cx="12" cy="12" r="2" />
</svg>
);
// Meal data with real Unsplash images
const meals = [
  {
    day: "Monday",
    date: "Mar 10",
    items: [
      { 
        name: "Vegetable Biryani", 
        time: "40 min", 
        calories: 450,
        protein: "12g",
        carbs: "65g",
        fat: "15g",
        diet: "vegetarian",
        difficulty: "Medium",
        img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Basmati rice", "Mixed vegetables", "Yogurt", "Spices", "Ghee"]
      },
      { 
        name: "Paneer Butter Masala", 
        time: "45 min", 
        calories: 520,
        protein: "18g",
        carbs: "25g",
        fat: "35g",
        diet: "vegetarian",
        difficulty: "Medium",
        img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Paneer", "Tomatoes", "Cream", "Butter", "Spices"]
      }
    ]
  },
  {
    day: "Tuesday",
    date: "Mar 11",
    items: [
      { 
        name: "Mediterranean Chickpea Salad", 
        time: "20 min", 
        calories: 320,
        protein: "10g",
        carbs: "45g",
        fat: "12g",
        diet: "vegan",
        difficulty: "Easy",
        img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Chickpeas", "Cucumber", "Tomatoes", "Feta", "Olive oil"]
      },
      { 
        name: "Grilled Salmon with Asparagus", 
        time: "25 min", 
        calories: 380,
        protein: "32g",
        carbs: "8g",
        fat: "22g",
        diet: "pescatarian",
        difficulty: "Medium",
        img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Salmon fillet", "Asparagus", "Lemon", "Garlic", "Herbs"]
      }
    ]
  },
  {
    day: "Wednesday",
    date: "Mar 12",
    items: [
      { 
        name: "Quinoa Buddha Bowl", 
        time: "30 min", 
        calories: 410,
        protein: "14g",
        carbs: "55g",
        fat: "16g",
        diet: "vegan",
        difficulty: "Easy",
        img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Quinoa", "Sweet potato", "Kale", "Avocado", "Tahini"]
      }
    ]
  },
  {
    day: "Thursday",
    date: "Mar 13",
    items: [
      { 
        name: "Shakshuka", 
        time: "35 min", 
        calories: 290,
        protein: "15g",
        carbs: "18g",
        fat: "18g",
        diet: "vegetarian",
        difficulty: "Easy",
        img: "https://images.unsplash.com/photo-1590412200988-4364e9379321?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Eggs", "Tomatoes", "Bell peppers", "Onion", "Spices"]
      },
      { 
        name: "Tom Yum Soup", 
        time: "20 min", 
        calories: 180,
        protein: "12g",
        carbs: "15g",
        fat: "8g",
        diet: "seafood",
        difficulty: "Medium",
        img: "https://images.unsplash.com/photo-1617196035154-1e1b5f3e30c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Shrimp", "Lemongrass", "Galangal", "Mushrooms", "Coconut milk"]
      }
    ]
  },
  {
    day: "Friday",
    date: "Mar 14",
    items: [
      { 
        name: "Chicken Teriyaki Bowl", 
        time: "35 min", 
        calories: 490,
        protein: "35g",
        carbs: "60g",
        fat: "12g",
        diet: "non-vegetarian",
        difficulty: "Medium",
        img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Chicken breast", "Broccoli", "Rice", "Teriyaki sauce", "Sesame"]
      }
    ]
  },
  {
    day: "Saturday",
    date: "Mar 15",
    items: [
      { 
        name: "Mushroom Risotto", 
        time: "50 min", 
        calories: 580,
        protein: "14g",
        carbs: "75g",
        fat: "22g",
        diet: "vegetarian",
        difficulty: "Hard",
        img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Arborio rice", "Mushrooms", "Parmesan", "White wine", "Vegetable broth"]
      }
    ]
  },
  {
    day: "Sunday",
    date: "Mar 16",
    items: [
      { 
        name: "Sunday Roast Chicken", 
        time: "90 min", 
        calories: 650,
        protein: "45g",
        carbs: "35g",
        fat: "38g",
        diet: "non-vegetarian",
        difficulty: "Hard",
        img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ingredients: ["Whole chicken", "Potatoes", "Carrots", "Rosemary", "Garlic"]
      }
    ]
  }
];

// Dietary preference options
const dietOptions = [
  { value: 'all', label: 'All Diets', icon: Utensils },
  { value: 'vegetarian', label: 'Vegetarian', icon: Leaf },
  { value: 'vegan', label: 'Vegan', icon: Leaf },
  { value: 'non-vegetarian', label: 'Non-Vegetarian', icon: Flame },
  { value: 'pescatarian', label: 'Pescatarian', icon: Fish },
  { value: 'gluten-free', label: 'Gluten Free', icon: Wheat },
  { value: 'dairy-free', label: 'Dairy Free', icon: Milk },
  { value: 'keto', label: 'Keto', icon: Flame },
  { value: 'low-carb', label: 'Low Carb', icon: TrendingUp }
];

// Meal type options
const mealTypes = [
  { value: 'breakfast', label: 'Breakfast', icon: Coffee },
  { value: 'lunch', label: 'Lunch', icon: Sun },
  { value: 'dinner', label: 'Dinner', icon: Moon },
  { value: 'snack', label: 'Snack', icon: Apple }
];

// Enhanced Meal Card Component
const MealCard = ({ meal, onAddToGrocery, onViewRecipe, onFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });


  const getDietIcon = () => {
    switch(meal.diet) {
      case 'vegetarian': return <Leaf className="w-3 h-3 text-green-600" />;
      case 'vegan': return <Leaf className="w-3 h-3 text-emerald-600" />;
      case 'non-vegetarian': return <Flame className="w-3 h-3 text-orange-600" />;
      default: return null;
    }
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={meal.img} 
          alt={meal.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute bottom-4 left-4 right-4 flex justify-between">
            <button 
              onClick={() => onFavorite && onFavorite(meal)}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40 transition"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
            <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40 transition">
              <Share2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Time Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
          <Clock size={12} className="text-purple-600" />
          <span>{meal.time}</span>
        </div>

        {/* Diet Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
          {getDietIcon()}
          <span className="capitalize">{meal.diet}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 text-lg">{meal.name}</h3>
          <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
            {meal.difficulty}
          </span>
        </div>

        {/* Nutritional Info */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Calories</p>
            <p className="font-semibold text-sm">{meal.calories}</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Protein</p>
            <p className="font-semibold text-sm">{meal.protein}</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">Carbs</p>
            <p className="font-semibold text-sm">{meal.carbs}</p>
          </div>
        </div>

        {/* Ingredients Preview */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Main ingredients:</p>
          <div className="flex flex-wrap gap-1">
            {meal.ingredients.slice(0, 3).map((ing, idx) => (
              <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                {ing}
              </span>
            ))}
            {meal.ingredients.length > 3 && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                +{meal.ingredients.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onAddToGrocery && onAddToGrocery(meal)}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-yellow-500 text-white px-4 py-2.5 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm font-medium"
          >
            <ShoppingCart size={16} />
            Add to List
          </button>
          <button
            onClick={() => onViewRecipe && onViewRecipe(meal)}
            className="flex items-center justify-center gap-2 border-2 border-purple-200 text-purple-600 px-4 py-2.5 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 text-sm font-medium"
          >
            <BookOpen size={16} />
            Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function MealPlanner() {
  const [selectedDiet, setSelectedDiet] = useState('all');
  const [selectedMealType, setSelectedMealType] = useState('all');
  const [servings, setServings] = useState(2);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [groceryList, setGroceryList] = useState([]);
  const [showGroceryList, setShowGroceryList] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [totalNutrition, setTotalNutrition] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });

  // Calculate total nutrition
  useEffect(() => {
    const totals = meals.reduce((acc, day) => {
      day.items.forEach(meal => {
        acc.calories += meal.calories;
        acc.protein += parseInt(meal.protein) || 0;
        acc.carbs += parseInt(meal.carbs) || 0;
        acc.fat += parseInt(meal.fat) || 0;
      });
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    setTotalNutrition(totals);
  }, []);

  const handleGeneratePlan = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const handleAddToGrocery = (meal) => {
    const newItems = meal.ingredients.map(ing => ({
      name: ing,
      meal: meal.name,
      checked: false
    }));
    setGroceryList([...groceryList, ...newItems]);
    setShowGroceryList(true);
  };

  const handleToggleGroceryItem = (index) => {
    const newList = [...groceryList];
    newList[index].checked = !newList[index].checked;
    setGroceryList(newList);
  };

  const handleRemoveGroceryItem = (index) => {
    const newList = groceryList.filter((_, i) => i !== index);
    setGroceryList(newList);
  };

  const handleDownloadGroceryList = () => {
    const listText = groceryList.map(item => `□ ${item.name} (from ${item.meal})`).join('\n');
    const blob = new Blob([listText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grocery-list.txt';
    a.click();
  };

  const weekNavigation = [
    { label: 'Current Week', value: 0 },
    { label: 'Next Week', value: 1 },
    { label: 'Following Week', value: 2 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#CBB9DF]/20 via-white to-[#fed348]/20">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#CBB9DF] to-[#fed348] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-white font-medium">AI-Powered Meal Planning</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Smart Meal Planner
          </h1>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Let our AI create personalized meal plans based on your dietary preferences, 
            nutritional goals, and taste preferences.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-white/80">Recipes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50k+</div>
              <div className="text-sm text-white/80">Meals Planned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">4.9</div>
              <div className="text-sm text-white/80">User Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Left Controls */}
            <div className="flex flex-wrap gap-3">
              {/* Diet Filter */}
              <div className="relative">
                <select 
                  value={selectedDiet}
                  onChange={(e) => setSelectedDiet(e.target.value)}
                  className="appearance-none pl-10 pr-8 py-2.5 border-2 border-[#CBB9DF] rounded-xl bg-white focus:outline-none focus:border-[#fed348] transition cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23CBB9DF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5rem' }}
                >
                  {dietOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#CBB9DF]" />
              </div>

              {/* Meal Type Filter */}
              <div className="relative">
                <select 
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value)}
                  className="appearance-none pl-10 pr-8 py-2.5 border-2 border-[#CBB9DF] rounded-xl bg-white focus:outline-none focus:border-[#fed348] transition cursor-pointer"
                >
                  <option value="all">All Meals</option>
                  {mealTypes.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <Utensils className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#CBB9DF]" />
              </div>

              {/* Servings */}
              <div className="flex items-center gap-2 border-2 border-[#CBB9DF] rounded-xl px-3 py-1">
                <Users className="w-4 h-4 text-[#CBB9DF]" />
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={servings}
                  onChange={(e) => setServings(parseInt(e.target.value) || 1)}
                  className="w-16 text-center outline-none"
                />
                <span className="text-gray-500 text-sm">servings</span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex gap-3 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 lg:flex-none">
                <input
                  type="text"
                  placeholder="Search meals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full lg:w-64 pl-10 pr-4 py-2.5 border-2 border-[#CBB9DF] rounded-xl focus:outline-none focus:border-[#fed348] transition"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#CBB9DF]" />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                className="px-6 py-2.5 bg-gradient-to-r from-[#CBB9DF] to-[#fed348] text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <CalendarDays className="w-5 h-5" />
                    Generate Meal Plan
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t">
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            
            {weekNavigation.map((week, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedWeek(week.value)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedWeek === week.value
                    ? 'bg-[#CBB9DF] text-white'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {week.label}
              </button>
            ))}
            
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <ArrowRight className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-[#CBB9DF]/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-[#CBB9DF]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Calories</p>
              <p className="text-xl font-bold text-gray-800">{totalNutrition.calories} kcal</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-[#fed348]/20 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-[#fed348]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Protein</p>
              <p className="text-xl font-bold text-gray-800">{totalNutrition.protein}g</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Carbs</p>
              <p className="text-xl font-bold text-gray-800">{totalNutrition.carbs}g</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Fat</p>
              <p className="text-xl font-bold text-gray-800">{totalNutrition.fat}g</p>
            </div>
          </div>
        </div>

        {/* Meal Grid */}
        <div className="bg-white/70 backdrop-blur rounded-3xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Your AI Meal Plan</h2>
              <p className="text-sm text-gray-500 mt-1">Personalized based on your preferences</p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-[#CBB9DF] rounded-xl hover:bg-[#CBB9DF]/10 transition"
              >
                <Filter className="w-4 h-4 text-[#CBB9DF]" />
                Filters
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#CBB9DF]/20 text-[#CBB9DF] rounded-xl hover:bg-[#CBB9DF]/30 transition">
                <Plus className="w-4 h-4" />
                Add Meal
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl animate-slideDown">
              <h3 className="font-semibold mb-3">Advanced Filters</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Under 30 min', 'Low Calorie', 'High Protein', 'Kid Friendly'].map((filter, idx) => (
                  <label key={idx} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-[#CBB9DF] focus:ring-[#CBB9DF]" />
                    <span className="text-sm text-gray-600">{filter}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Meals Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {meals.map((day, dayIdx) => (
              <div key={day.day} className="space-y-4">
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800">{day.day}</h3>
                    <p className="text-xs text-gray-500">{day.date}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-[#CBB9DF]/20 text-[#CBB9DF] rounded-full">
                    {day.items.length} meals
                  </span>
                </div>

                {/* Meals */}
                <div className="space-y-4">
                  {day.items.map((meal, mealIdx) => (
                    <MealCard 
                      key={mealIdx} 
                      meal={meal}
                      onAddToGrocery={handleAddToGrocery}
                      onViewRecipe={(meal) => console.log('View recipe:', meal)}
                      onFavorite={(meal) => console.log('Favorite:', meal)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grocery List Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#CBB9DF] to-[#fed348] p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6" />
                  Smart Grocery List
                </h2>
                <p className="text-white/90 text-sm mt-1">
                  {groceryList.length} items • Auto-generated from your meal plan
                </p>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowGroceryList(!showGroceryList)}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition"
                >
                  {showGroceryList ? 'Hide' : 'Show'} List
                </button>
                <button 
                  onClick={handleDownloadGroceryList}
                  className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-white/90 transition flex items-center gap-2"
                  disabled={groceryList.length === 0}
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          </div>

          {showGroceryList && (
            <div className="p-6 animate-slideDown">
              {groceryList.length > 0 ? (
                <div className="space-y-3">
                  {/* Group by meal */}
                  {meals.map(day => {
                    const dayItems = groceryList.filter(item => 
                      day.items.some(meal => meal.name === item.meal)
                    );
                    
                    if (dayItems.length === 0) return null;
                    
                    return (
                      <div key={day.day} className="space-y-2">
                        <h4 className="font-semibold text-gray-700 text-sm">{day.day}</h4>
                        {dayItems.map((item, idx) => {
                          const globalIndex = groceryList.findIndex(i => i === item);
                          return (
                            <div key={idx} className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition">
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={item.checked}
                                  onChange={() => handleToggleGroceryItem(globalIndex)}
                                  className="w-4 h-4 text-[#CBB9DF] rounded focus:ring-[#CBB9DF]"
                                />
                                <span className={item.checked ? 'line-through text-gray-400' : 'text-gray-700'}>
                                  {item.name}
                                </span>
                                <span className="text-xs text-gray-400">from {item.meal}</span>
                              </div>
                              <button
                                onClick={() => handleRemoveGroceryItem(globalIndex)}
                                className="opacity-0 group-hover:opacity-100 transition"
                              >
                                <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}

                  {/* Summary */}
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Items:</span>
                      <span className="font-bold">{groceryList.length}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Checked Items:</span>
                      <span className="font-bold">{groceryList.filter(i => i.checked).length}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your grocery list is empty</p>
                  <p className="text-sm text-gray-400 mt-1">Add meals to your plan to generate a list</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-[#CBB9DF]/10 to-[#fed348]/10 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#fed348]" />
            AI Meal Planning Tips
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#CBB9DF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-[#CBB9DF]" />
              </div>
              <p className="text-sm text-gray-600">Prep ingredients on Sunday to save time during the week</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#fed348]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Leaf className="w-4 h-4 text-[#fed348]" />
              </div>
              <p className="text-sm text-gray-600">Mix and match meals to reduce food waste</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Adjust portions to meet your fitness goals</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}