import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  LogOut,
  Settings,
  Edit2,
  Save,
  X,
  Camera,
  Award,
  Shield,
  Moon,
  Sun,
  Bell,
  BellOff,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Heart,
  ShoppingBag,
  Crown,
  Sparkles,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [updating, setUpdating] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [localSettings, setLocalSettings] = useState({
    theme: "light",
    notifications: true,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserData();
  }, [token]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("User data fetched:", res.data);
      setUser(res.data);
      setEditedName(res.data.name || "");
      if (res.data.settings) {
        setLocalSettings(res.data.settings);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Failed to load user data. Please try again.");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!editedName.trim()) return;
    try {
      setUpdating(true);
      await axios.put(
        "http://localhost:5000/api/user/update",
        { name: editedName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({ ...user, name: editedName });
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Premium badge logic
  const isPremium = user?.plan?.toLowerCase() === "premium";
  const RoleIcon = user?.role === "admin" ? Shield : User;

  // Stats data (can be replaced with real data from API)
  const stats = [
    { icon: BookOpen, label: "Recipes Created", value: user?.recipesCount || 0, color: "from-purple-500 to-purple-600", bg: "from-purple-50 to-purple-100" },
    { icon: Heart, label: "Saved Recipes", value: user?.savedCount || 0, color: "from-pink-500 to-pink-600", bg: "from-pink-50 to-pink-100" },
    { icon: ShoppingBag, label: "Grocery Lists", value: user?.groceryListsCount || 0, color: "from-green-500 to-green-600", bg: "from-green-50 to-green-100" },
  ];

  const handleThemeToggle = () => {
    setLocalSettings(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
    // Optional: save to backend or apply theme
  };

  const handleNotificationToggle = () => {
    setLocalSettings(prev => ({ ...prev, notifications: !prev.notifications }));
    // Optional: save to backend
  };

  const handleUpgrade = () => {
    alert("🚀 Upgrade flow would open here. Redirect to pricing page.");
    // navigate("/pricing");
  };

  const handleManageSubscription = () => {
    alert("📦 Manage subscription flow.");
  };

  const handleGenerateRecipe = () => {
    navigate("/generate"); // Adjust route as needed
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <Navbar />
        <div className="pt-24 pb-12 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="animate-pulse">
              <div className="h-64 bg-white/50 rounded-3xl shadow-xl"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <Navbar />
        <div className="pt-24 pb-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 text-center">
              <div className="text-red-500 mb-4 text-lg">{error}</div>
              <button
                onClick={fetchUserData}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-5xl mx-auto space-y-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Main Profile Card */}
          <motion.div
            variants={fadeInUp}
            className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/40"
          >
            {/* Animated gradient border effect */}
            <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 pointer-events-none" />
            
            {/* Cover with abstract pattern */}
            <div className="relative h-48 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 overflow-hidden">
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}
              />
              {/* Decorative blur circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
            </div>

            {/* Profile Section */}
            <div className="px-6 sm:px-8 pb-8 relative">
              {/* Avatar with premium glow ring */}
              <div className="flex flex-col sm:flex-row sm:items-end -mt-20 mb-6 gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative group"
                >
                  <div className={`relative w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 ${isPremium ? 'ring-4 ring-yellow-400/70 ring-offset-2 ring-offset-white' : ''}`}>
                    {user?.picture && !imageError ? (
                      <img
                        src={user.picture}
                        alt={user?.name}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                        {getInitials(user?.name)}
                      </div>
                    )}
                    {isPremium && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full p-1 shadow-lg">
                        <Crown size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                  <button className="absolute bottom-2 right-2 bg-white text-purple-500 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-purple-50 hover:scale-110">
                    <Camera size={16} />
                  </button>
                </motion.div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    {editMode ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="text-3xl sm:text-4xl font-bold bg-transparent border-b-2 border-purple-500 focus:outline-none px-1 py-0.5 w-64"
                          placeholder="Your name"
                          autoFocus
                        />
                        <button
                          onClick={handleUpdateProfile}
                          disabled={updating}
                          className="text-green-500 hover:text-green-600 disabled:opacity-50 p-1 rounded-full hover:bg-green-50 transition"
                        >
                          <Save size={20} />
                        </button>
                        <button
                          onClick={() => {
                            setEditMode(false);
                            setEditedName(user?.name || "");
                          }}
                          className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                          {user?.name}
                        </h1>
                        <button
                          onClick={() => setEditMode(true)}
                          className="text-gray-400 hover:text-purple-500 p-1 rounded-full hover:bg-purple-50 transition"
                        >
                          <Edit2 size={18} />
                        </button>
                      </>
                    )}
                    
                    {/* Premium Badge */}
                    {isPremium ? (
                      <motion.span
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md"
                      >
                        <Crown size={16} />
                        Premium
                      </motion.span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                        Free Plan
                      </span>
                    )}
                    
                    {user?.role === "admin" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                        <Shield size={14} />
                        Admin
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 text-sm mt-2">
                    <Mail size={14} />
                    <span>{user?.email}</span>
                  </div>
                  
                  <p className="text-gray-400 text-xs mt-1 flex items-center justify-center sm:justify-start gap-1">
                    <Calendar size={12} />
                    Member since {formatDate(user?.createdAt)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {!isPremium ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleUpgrade}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                      <Sparkles size={18} />
                      Upgrade to Premium
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={handleManageSubscription}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-all"
                    >
                      <Settings size={18} />
                      Manage Subscription
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all"
                  >
                    <LogOut size={18} />
                    <span className="font-medium">Logout</span>
                  </motion.button>
                </div>
              </div>

              {/* Stats Cards with modern glass effect */}
              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8"
              >
                {stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    variants={fadeInUp}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group relative overflow-hidden bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bg} text-${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon size={24} className={`text-${stat.color.split('-')[1]}-600`} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Details */}
            <motion.div
              variants={fadeInUp}
              className="md:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/40"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <User size={20} className="text-purple-500" />
                Profile Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-purple-50/30 transition">
                  <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg text-purple-600">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                    <p className="text-gray-800 font-medium">{user?.email}</p>
                  </div>
                </div>

                {user?.googleId && (
                  <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-purple-50/30 transition">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg text-blue-600">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Connected with Google</p>
                      <p className="text-gray-800 font-medium">Account linked</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-purple-50/30 transition">
                  <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg text-amber-600">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Account Created</p>
                    <p className="text-gray-800 font-medium">{formatDate(user?.createdAt)}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Settings Panel */}
            <motion.div
              variants={fadeInUp}
              className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/40"
            >
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-full flex items-center justify-between text-left"
              >
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Settings size={20} className="text-purple-500" />
                  Settings
                </h2>
                <motion.div animate={{ rotate: showSettings ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={20} className="text-gray-500" />
                </motion.div>
              </button>

              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 space-y-4 overflow-hidden"
                  >
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer" onClick={handleThemeToggle}>
                      <div className="flex items-center gap-3">
                        {localSettings.theme === 'dark' ? <Moon size={18} className="text-gray-600" /> : <Sun size={18} className="text-amber-500" />}
                        <span className="text-gray-700">Dark Mode</span>
                      </div>
                      <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${localSettings.theme === 'dark' ? 'bg-purple-500' : 'bg-gray-300'}`}>
                        <motion.div
                          className={`w-4 h-4 rounded-full bg-white`}
                          animate={{ x: localSettings.theme === 'dark' ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </div>
                    </div>

                    {/* Notifications Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer" onClick={handleNotificationToggle}>
                      <div className="flex items-center gap-3">
                        {localSettings.notifications ? <Bell size={18} className="text-purple-500" /> : <BellOff size={18} className="text-gray-400" />}
                        <span className="text-gray-700">Notifications</span>
                      </div>
                      <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${localSettings.notifications ? 'bg-purple-500' : 'bg-gray-300'}`}>
                        <motion.div
                          className="w-4 h-4 rounded-full bg-white"
                          animate={{ x: localSettings.notifications ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Recent Activity with Premium Empty State */}
          <motion.div
            variants={fadeInUp}
            className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/40"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-1 h-5 bg-purple-500 rounded-full"></span>
                Recent Activity
              </h2>
            </div>
            
            <div className="p-10 text-center">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
                  <Sparkles size={40} className="text-purple-400" />
                </div>
                <p className="text-gray-500 mb-2 text-lg font-medium">No activity yet</p>
                <p className="text-gray-400 text-sm mb-6">Start generating recipes to see your journey here</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerateRecipe}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    <Zap size={18} />
                    Generate Recipe ⚡
                  </motion.button>
                  {!isPremium && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleUpgrade}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                      <Crown size={18} />
                      Unlock Premium Features
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;