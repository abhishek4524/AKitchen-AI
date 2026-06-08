import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import LoginRequiredModal from '../components/LoginRequiredModal';
import { trackGuestUsage } from '../utils/guest';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// ========== Reusable Components ==========

const ScoreCircle = ({ score, label }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const progressOffset = circumference - (score / 100) * circumference;
    setOffset(progressOffset);
  }, [score, circumference]);

  const isHealthy = score >= 60;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#e2e8f0"
            strokeWidth="10"
            fill="none"
            className="stroke-current"
          />
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            stroke="url(#gradient)"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeDasharray={circumference}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">{score}%</span>
          <span className={`text-xs font-semibold ${isHealthy ? 'text-green-500' : 'text-red-500'}`}>
            {isHealthy ? 'Healthy' : 'Not Healthy'}
          </span>
        </div>
      </div>
    </div>
  );
};

const InputCard = ({ foodName, setFoodName, onAnalyze, loading, onImageUpload, imagePreview }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Food Name</label>
          <input
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder="e.g., Aalu Bhujia, Pizza, Salad"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="relative flex items-center justify-center">
          <div className="flex-grow h-px bg-gray-200"></div>
          <span className="px-4 text-sm text-gray-400 bg-white">or</span>
          <div className="flex-grow h-px bg-gray-200"></div>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          {imagePreview ? (
            <div className="flex flex-col items-center">
              <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg mb-2" />
              <p className="text-sm text-gray-500">Click or drag to change</p>
            </div>
          ) : (
            <>
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Drag & drop or click to upload</p>
              <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
            </>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAnalyze}
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            'Analyze with AI'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

const ResultCard = ({ data }) => {
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100"
    >
      <div className="flex items-center space-x-4 mb-6">
        <img src={data.imageUrl} alt={data.name} className="w-20 h-20 rounded-xl object-cover shadow-md" />
        <div>
          <h3 className="text-xl font-bold text-gray-800">{data.name}</h3>
          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
            {data.category}
          </span>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <ScoreCircle score={data.healthScore} />
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <p className="text-gray-700 text-sm leading-relaxed">{data.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          <h4 className="font-semibold text-red-600 flex items-center gap-2">
            <span>❌</span> Why Not Healthy
          </h4>
          <ul className="space-y-2">
            {data.badPoints.map((point, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-red-400 text-xs mt-1">●</span> {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold text-green-600 flex items-center gap-2">
            <span>✅</span> Good Points
          </h4>
          <ul className="space-y-2">
            {data.goodPoints.map((point, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-green-400 text-xs mt-1">●</span> {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-50 rounded-xl p-4">
          <h4 className="font-semibold text-red-700 mb-2">Unhealthy Ingredients</h4>
          <div className="flex flex-wrap gap-2">
            {data.unhealthyIngredients.map((ing, idx) => (
              <span key={idx} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">{ing}</span>
            ))}
          </div>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <h4 className="font-semibold text-green-700 mb-2">Healthy Ingredients</h4>
          <div className="flex flex-wrap gap-2">
            {data.healthyIngredients.map((ing, idx) => (
              <span key={idx} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">{ing}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ========== Mock Data Generator ==========
const generateMockAnalysis = (foodName) => {
  const name = foodName.toLowerCase().trim();
  
  // Default data for unknown foods
  let data = {
    name: foodName,
    category: 'General Food',
    healthScore: 55,
    summary: 'This food has average nutritional value. Consider balancing with whole foods.',
    badPoints: ['May contain preservatives', 'Moderate sodium content', 'Processed ingredients possible'],
    goodPoints: ['Provides energy', 'Contains some essential nutrients', 'Convenient option'],
    unhealthyIngredients: ['Refined flour', 'Added sugar', 'Artificial flavors'],
    healthyIngredients: ['Vitamins', 'Minerals', 'Fiber'],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop'
  };

  // Pizza
  if (name.includes('pizza')) {
    data = {
      name: foodName,
      category: 'Fast Food / Italian',
      healthScore: 32,
      summary: 'High in calories, saturated fat, and sodium. Limited nutritional density.',
      badPoints: ['High in refined carbs', 'High saturated fat from cheese', 'Excessive sodium', 'Low fiber content'],
      goodPoints: ['Contains calcium from cheese', 'Provides protein', 'Tomatoes offer lycopene'],
      unhealthyIngredients: ['Refined wheat flour', 'Processed cheese', 'Cured meats', 'Added sugar in sauce'],
      healthyIngredients: ['Tomato sauce', 'Oregano', 'Bell peppers (if veggie)'],
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=300&fit=crop'
    };
  } 
  // Salad
  else if (name.includes('salad') || name.includes('lettuce') || name.includes('kale')) {
    data = {
      name: foodName,
      category: 'Whole Food / Vegetables',
      healthScore: 88,
      summary: 'Excellent choice! Rich in vitamins, minerals, and antioxidants. Low in calories but high in nutrients.',
      badPoints: ['Watch out for high-calorie dressings', 'May lack protein if not added'],
      goodPoints: ['High fiber content', 'Rich in antioxidants', 'Low calorie density', 'Hydrating properties'],
      unhealthyIngredients: ['None inherently - watch dressings'],
      healthyIngredients: ['Leafy greens', 'Fresh vegetables', 'Fiber', 'Phytonutrients'],
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop'
    };
  }
  // Aalu Bhujia / Chips / Snacks
  else if (name.includes('aalu') || name.includes('bhujia') || name.includes('chip') || name.includes('snack')) {
    data = {
      name: foodName,
      category: 'Packaged Snack',
      healthScore: 25,
      summary: 'Highly processed snack with minimal nutritional value. High in unhealthy fats and sodium.',
      badPoints: ['Deep fried in unhealthy oils', 'High sodium content', 'Contains preservatives', 'Empty calories'],
      goodPoints: ['Tasty occasional treat', 'Provides quick energy'],
      unhealthyIngredients: ['Hydrogenated oils', 'Excess salt', 'Stabilizers', 'Artificial colors'],
      healthyIngredients: ['Potatoes (minimal)', 'Spices'],
      imageUrl: 'https://images.unsplash.com/photo-1599458252573-56ae36120de1?w=300&h=300&fit=crop'
    };
  }
  // Burger
  else if (name.includes('burger')) {
    data = {
      name: foodName,
      category: 'Fast Food',
      healthScore: 40,
      summary: 'Moderate nutritional value. High in protein but also high in saturated fat and refined carbs.',
      badPoints: ['High in saturated fat', 'Refined bun', 'Often high in calories', 'Low vegetable content'],
      goodPoints: ['Good protein source', 'Contains iron from meat', 'Calcium from cheese'],
      unhealthyIngredients: ['White flour bun', 'Processed cheese', 'Mayonnaise', 'Fried patty'],
      healthyIngredients: ['Lettuce', 'Tomato', 'Onion', 'Beef patty (protein)'],
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop'
    };
  }
  // Sushi
  else if (name.includes('sushi')) {
    data = {
      name: foodName,
      category: 'Japanese',
      healthScore: 78,
      summary: 'Generally healthy option with lean protein and vegetables. Watch sodium from soy sauce.',
      badPoints: ['White rice has high glycemic index', 'May contain raw fish (pregnancy risk)'],
      goodPoints: ['Lean protein from fish', 'Omega-3 fatty acids', 'Seaweed provides iodine', 'Low saturated fat'],
      unhealthyIngredients: ['White rice', 'Cream cheese (in some rolls)', 'Tempura batter'],
      healthyIngredients: ['Fresh fish', 'Nori seaweed', 'Cucumber', 'Avocado', 'Wasabi'],
      imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&h=300&fit=crop'
    };
  }

  return data;
};

// ========== Main Component ==========
const NutritionAI = () => {
  const [foodName, setFoodName] = useState('Pizza Margherita');
  const [imagePreview, setImagePreview] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Load initial data on mount
  useEffect(() => {
    const initialData = generateMockAnalysis('Pizza Margherita');
    setAnalysisData(initialData);
  }, []);

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      // Optional: extract filename to set food name
      const fileName = file.name.replace(/\.[^/.]+$/, '');
      if (fileName && fileName.length > 0) {
        setFoodName(fileName.replace(/[-_]/g, ' '));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!foodName.trim()) return;
    setLoading(true);
    try {
      // If unauthenticated, track guest usage for nutrition AI
      const token = localStorage.getItem('token');
      if (!token) {
        const trackData = await trackGuestUsage('nutrition_ai');
        if (trackData.requiresLogin) {
          setShowLoginModal(true);
          return;
        }
      }

      // Call actual backend API
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ foodName })
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze food');
      }
      
      const data = await response.json();
      setAnalysisData(data);
    } catch (err) {
      console.error('Analyze error', err);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { icon: "📝", title: "Enter Food", description: "Type food name or upload a photo of your meal" },
    { icon: "🤖", title: "AI Analysis", description: "Our AI scans ingredients and nutritional data" },
    { icon: "📊", title: "Get Report", description: "Receive detailed health score and insights" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-4">
            Nutrition AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Analyze how healthy your food is using artificial intelligence
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Left Panel */}
          <InputCard
            foodName={foodName}
            setFoodName={setFoodName}
            onAnalyze={handleAnalyze}
            loading={loading}
            onImageUpload={handleImageUpload}
            imagePreview={imagePreview}
          />
          
          {/* Right Panel - Results */}
          <AnimatePresence mode="wait">
            {analysisData && <ResultCard key={analysisData.name} data={analysisData} />}
          </AnimatePresence>
        </div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100"
              >
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-gray-400 border-t border-gray-100 pt-8 mt-8"
        >
          <p>⚠️ Disclaimer: This AI-generated analysis is for informational purposes only and should not be considered medical or professional advice. Always consult a qualified healthcare professional before making dietary or health-related decisions.</p>
        </motion.div>
      </main>
      <AnimatePresence>
        {showLoginModal && (
          <LoginRequiredModal
            title="Continue to analyze nutrition"
            message="Your free AI request is used. Continue with Google to analyze more foods with your account."
            onClose={() => setShowLoginModal(false)}
          />
        )}
      </AnimatePresence>
          <Footer />
    </div>
  );
};

export default NutritionAI;
