import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import {
  Target,
  Eye,
  Sparkles,
  Wand,
  ShoppingCart,
  Share,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  ChevronRight,
  Star,
  Check,
  Clock,
  Users,
  BookOpen,
  ChefHat,
  Award,
  Heart,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Play,
  Quote,
  Zap,
  TrendingUp,
  Globe,
  Coffee,
  ThumbsUp
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';

// ------------------- CountUp Component -------------------
const CountUp = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (!inView) return;
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      setCount(Math.floor(percentage * end));
      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [inView, end, duration]);

  return (
    <span ref={ref} className="text-4xl font-bold text-gray-800">
      {count}{suffix}
    </span>
  );
};

// ------------------- Testimonial Card Component -------------------
const TestimonialCard = ({ name, role, content, rating, image, delay }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  
  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
        ))}
      </div>
      <Quote className="w-8 h-8 text-purple-400 mb-2 opacity-50" />
      <p className="text-gray-600 mb-6 italic">{content}</p>
      <div className="flex items-center gap-4">
        <img
          src={image || `https://ui-avatars.com/api/?name=${name}&background=8B5CF6&color=fff&bold=true`}
          alt={name}
          className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
        />
        <div>
          <h4 className="font-semibold text-gray-800">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
};

// ------------------- Team Member Component -------------------
const TeamMember = ({ name, role, image, delay }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  
  return (
    <div
      ref={ref}
      className={`group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative mb-6">
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-purple-200 group-hover:border-purple-400 transition-all">
          <img
            src={image || `https://ui-avatars.com/api/?name=${name}&background=8B5CF6&color=fff&bold=true&size=128`}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-2 right-1/2 translate-x-16 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
      </div>
      <h3 className="text-xl font-bold text-gray-800 text-center mb-1">{name}</h3>
      <p className="text-purple-600 text-center mb-4">{role}</p>
      <div className="flex justify-center gap-3">
        <a href="#" className="bg-gray-100 p-2 rounded-full hover:bg-purple-100 transition-colors">
          <Linkedin className="w-4 h-4 text-gray-600 hover:text-purple-600" />
        </a>
        <a href="#" className="bg-gray-100 p-2 rounded-full hover:bg-purple-100 transition-colors">
          <Mail className="w-4 h-4 text-gray-600 hover:text-purple-600" />
        </a>
      </div>
    </div>
  );
};

// ------------------- Main AboutPage Component -------------------
const AboutPage = () => {
  const navigate = useNavigate();
  
  // Inject custom animations
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      @keyframes pulse-slow {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
      }
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-50px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(50px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      .animate-float {
        animation: float 4s ease-in-out infinite;
      }
      .animate-pulse-slow {
        animation: pulse-slow 3s ease-in-out infinite;
      }
      .delay-200 {
        animation-delay: 0.2s;
      }
      .delay-500 {
        animation-delay: 0.5s;
      }
      .slide-in-left {
        animation: slideInLeft 1s ease-out forwards;
      }
      .slide-in-right {
        animation: slideInRight 1s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  // Scroll animations
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: missionRef, inView: missionInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: featuresRef, inView: featuresInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: storyRef, inView: storyInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: teamRef, inView: teamInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: testimonialsRef, inView: testimonialsInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: ctaRef, inView: ctaInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  // Feature cards data
  const features = [
    {
      icon: Sparkles,
      title: 'AI Powered',
      description: 'Smart recipe generation from your ingredients with personalized recommendations.',
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      gradient: 'from-purple-500 to-pink-500',
      stats: '10K+ recipes'
    },
    {
      icon: Wand,
      title: 'Easy to Use',
      description: 'Simple & beautiful interface designed for cooks of all skill levels.',
      color: 'text-green-600',
      bg: 'bg-green-100',
      gradient: 'from-green-500 to-emerald-500',
      stats: '5 min setup'
    },
    {
      icon: ShoppingCart,
      title: 'Grocery Assistant',
      description: 'Auto-add ingredients to your list and get the best prices.',
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      gradient: 'from-orange-500 to-red-500',
      stats: '500+ stores'
    },
    {
      icon: Share,
      title: 'Save & Share',
      description: 'Keep your favorite recipes and share them with friends.',
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      gradient: 'from-blue-500 to-cyan-500',
      stats: '50K+ shares'
    },
    {
      icon: Heart,
      title: 'Dietary Preferences',
      description: 'Support for vegan, keto, gluten-free, and more dietary needs.',
      color: 'text-red-600',
      bg: 'bg-red-100',
      gradient: 'from-red-500 to-pink-500',
      stats: '20+ diets'
    },
    {
      icon: Zap,
      title: 'Quick Recipes',
      description: 'Find meals that match your available time from 15 mins to gourmet.',
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
      gradient: 'from-yellow-500 to-orange-500',
      stats: '1000+ recipes'
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Home Cook',
      content: 'AKitchenAI has completely transformed how I cook! The AI suggestions are incredibly accurate and have helped me discover so many new dishes.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108777-466fd103c8ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Michael Chen',
      role: 'Professional Chef',
      content: 'As a chef, I was skeptical about AI in cooking, but this tool is amazing! It\'s like having a creative sous chef always ready with new ideas.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Food Blogger',
      content: 'The grocery assistant feature saves me hours every week! I can plan meals and shop efficiently. My followers love the recipes I discover here.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    }
  ];

  // Team data
  const team = [
    {
      name: 'Alex Thompson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Priya Patel',
      role: 'Head of AI',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'David Kim',
      role: 'Master Chef',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Lisa Wang',
      role: 'UX Director',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-sans antialiased bg-white overflow-x-hidden">
      <Navbar />

      {/* ========== HERO SECTION ========== */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-[#f8f0ff] via-white to-[#f0e6ff] pt-32 pb-20 overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow delay-500" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-200/30 to-orange-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-1000 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-8 hover:shadow-xl transition-shadow cursor-pointer"
                 onClick={() => handleNavigation('/')}>
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Welcome to the future of cooking</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              About <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">AKitchenAI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Cook smarter with AI — Discover, Create & Enjoy Amazing Recipes personalized just for you.
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <button
                onClick={() => handleNavigation('/ai-recipe')}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-full font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Try AI Recipe Generator
                  <ChefHat className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <button
                onClick={() => handleNavigation('/explore')}
                className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-purple-200 hover:border-purple-400"
              >
                Explore Recipes
              </button>
            </div>

            {/* Floating cards with hero image */}
            <div className="relative mt-16 flex justify-center items-center min-h-[400px]">
              {/* Central image with floating animation */}
              <div className="relative w-72 h-72 md:w-96 md:h-96 animate-float group cursor-pointer"
                   onClick={() => handleNavigation('/explore')}>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />
                <img
                  src={ "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                  alt="Delicious food"
                  className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
              </div>

              {/* Left floating card - Interactive */}
              <div className="absolute left-0 lg:left-20 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 w-64 animate-float cursor-pointer hover:scale-105 transition-all duration-300"
                   onClick={() => handleNavigation('/ai-recipe')}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                  </div>
                  <span className="font-semibold text-gray-800">AI Generated</span>
                </div>
                <p className="text-sm text-gray-600">Today's special recipe based on your preferences</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-purple-600 group-hover:gap-3 transition-all">
                  <span>View Recipe</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Right floating card - Interactive */}
              <div className="absolute right-0 lg:right-20 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 w-64 animate-float delay-200 cursor-pointer hover:scale-105 transition-all duration-300"
                   onClick={() => handleNavigation('/grocery')}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-semibold text-gray-800">Smart List</span>
                </div>
                <ul className="space-y-2">
                  {['Paneer', 'Tomatoes', 'Onions', 'Spices'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== OUR STORY SECTION ========== */}
      <section ref={storyRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Story content */}
            <div className={`space-y-6 ${storyInView ? 'slide-in-left' : 'opacity-0'}`}>
              <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
                <ChefHat className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Our Journey</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                From a Simple Idea to
                <span className="block text-purple-600 mt-2">Your Kitchen Companion</span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                AKitchenAI was born in 2023 when our founder, a passionate home cook and AI enthusiast, 
                realized that technology could make cooking more accessible, creative, and fun for everyone.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                What started as a small project has grown into a vibrant community of food lovers, 
                home cooks, and professional chefs who share a common goal: to make every meal memorable.
              </p>

              {/* Milestones */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">2023</div>
                  <div className="text-sm text-gray-500">Founded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">50K+</div>
                  <div className="text-sm text-gray-500">Recipes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">150+</div>
                  <div className="text-sm text-gray-500">Countries</div>
                </div>
              </div>
            </div>

            {/* Right side - Story images */}
            <div className={`relative ${storyInView ? 'slide-in-right' : 'opacity-0'}`}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Cooking process"
                    className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1556911073-52567bd96c3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Fresh ingredients"
                    className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  />
                </div>
                <div className="pt-8">
                  <img
                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Team cooking"
                    className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  />
                </div>
              </div>
              
              {/* Decorative element */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-200 rounded-full opacity-30 blur-2xl" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-orange-200 rounded-full opacity-30 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ========== MISSION & VISION SECTION ========== */}
      <section ref={missionRef} className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`bg-white rounded-3xl shadow-2xl p-8 md:p-12 transition-all duration-700 ${
              missionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
              Our <span className="text-purple-600">Mission</span> & Vision
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Mission Card */}
              <div className="group relative bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-purple-200">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  To democratize cooking expertise through AI, making professional-quality meals accessible 
                  to everyone, regardless of their skill level or kitchen experience.
                </p>
                <ul className="space-y-3">
                  {['Personalized recipe recommendations', 'Smart grocery management', 'Cooking skill development'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <Check className="w-5 h-5 text-purple-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Vision Card */}
              <div className="group relative bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-orange-200">
                  <Eye className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  To create a world where cooking is effortless, enjoyable, and sustainable, powered by 
                  AI that understands your taste, schedule, and dietary needs.
                </p>
                <ul className="space-y-3">
                  {['Global culinary community', 'Zero food waste future', 'Cultural recipe preservation'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section ref={featuresRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Why Choose <span className="text-purple-600">AKitchen AI</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover what makes us your perfect kitchen companion
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer ${
                    featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                  onClick={() => handleNavigation('/features')}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity`} />
                  
                  <div className={`w-16 h-16 ${feature.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-600">{feature.stats}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== STATS SECTION ========== */}
      <section ref={statsRef} className="py-20 bg-gradient-to-br from-purple-900 to-orange-900 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Made with <span className="text-red-400">❤️</span> by Food & AI Enthusiasts
            </h3>
            <p className="text-lg text-purple-200">Join thousands of happy cooks using AKitchenAI</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Recipes Generated */}
            <div className={`text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 ${
              statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="w-20 h-20 bg-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <CountUp end={15000} suffix="+" />
              <p className="text-purple-200 mt-2 text-lg">Recipes Generated</p>
            </div>

            {/* Happy Users */}
            <div className={`text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 delay-100 ${
              statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="w-20 h-20 bg-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <CountUp end={8000} suffix="+" />
              <p className="text-purple-200 mt-2 text-lg">Happy Users</p>
            </div>

            {/* AI Cooking */}
            <div className={`text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 delay-200 ${
              statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="w-20 h-20 bg-orange-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <CountUp end={24} suffix="/7" />
              <p className="text-purple-200 mt-2 text-lg">AI Support</p>
            </div>

            {/* Countries */}
            <div className={`text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 delay-300 ${
              statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="w-20 h-20 bg-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <CountUp end={150} suffix="+" />
              <p className="text-purple-200 mt-2 text-lg">Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TEAM SECTION ========== */}
      <section ref={teamRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Meet Our <span className="text-purple-600">Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate people behind AKitchenAI
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <TeamMember key={idx} {...member} delay={idx * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS SECTION ========== */}
      <section ref={testimonialsRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              What Our <span className="text-purple-600">Users Say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied cooks who've transformed their kitchen experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <TestimonialCard key={idx} {...testimonial} delay={idx * 150} />
            ))}
          </div>

          {/* Rating summary */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-lg">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600">Rated 4.9/5 from 2,500+ reviews</span>
              <ThumbsUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section ref={ctaRef} className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`bg-gradient-to-r from-purple-600 to-orange-500 rounded-3xl p-12 md:p-16 shadow-2xl transition-all duration-700 ${
            ctaInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Cooking Experience?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of home cooks who are already creating amazing meals with AKitchenAI
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => handleNavigation('/ai-recipe')}
                className="group px-8 py-4 bg-white text-purple-600 rounded-full font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                Get Started Free
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => window.open('https://www.youtube.com/watch?v=demo', '_blank')}
                className="group px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap justify-center gap-8 items-center">
              <div className="flex items-center gap-2 text-white/80">
                <Check className="w-4 h-4" />
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Check className="w-4 h-4" />
                <span className="text-sm">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Check className="w-4 h-4" />
                <span className="text-sm">Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CONTACT SECTION ========== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact info */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Get in <span className="text-purple-600">Touch</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                    <a href="mailto:support@akitchenai.com" className="text-gray-600 hover:text-purple-600 transition">
                      support@akitchenai.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                    <a href="tel:+15551234567" className="text-gray-600 hover:text-purple-600 transition">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Office</h3>
                    <p className="text-gray-600">
                      123 Culinary Street<br />
                      San Francisco, CA 94105
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a message</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition resize-none"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ========== NEWSLETTER SECTION ========== */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-white/90 mb-8">
            Get weekly recipe inspiration, cooking tips, and exclusive offers
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-purple-600 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              Subscribe
            </button>
          </form>
          
          <p className="text-white/70 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-10">
            {/* Brand Column */}
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent cursor-pointer"
                  onClick={() => handleNavigation('/')}>
                AKitchenAI
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Your AI-powered kitchen companion. Cook smarter, not harder with intelligent recipe recommendations and smart grocery management.
              </p>
              <div className="flex space-x-4">
                <a href="https://facebook.com/akitchenai" target="_blank" rel="noopener noreferrer" 
                   className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors hover:scale-110 transform">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://instagram.com/akitchenai" target="_blank" rel="noopener noreferrer"
                   className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors hover:scale-110 transform">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com/company/akitchenai" target="_blank" rel="noopener noreferrer"
                   className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors hover:scale-110 transform">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://youtube.com/akitchenai" target="_blank" rel="noopener noreferrer"
                   className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors hover:scale-110 transform">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'AI Recipe', path: '/ai-recipe' },
                  { name: 'Explore Recipes', path: '/explore' },
                  { name: 'Grocery List', path: '/grocery' }
                ].map((item, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 w-full text-left"
                    >
                      <ChevronRight className="w-4 h-4" />
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Privacy Policy', path: '/privacy' },
                  { name: 'Terms & Conditions', path: '/terms' },
                  { name: 'Contact', path: '/contact' },
                  { name: 'FAQ', path: '/faq' }
                ].map((item, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 w-full text-left"
                    >
                      <ChevronRight className="w-4 h-4" />
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/akitchenai' },
                  { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/akitchenai' },
                  { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/company/akitchenai' },
                  { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/akitchenai' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <li key={idx}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                      >
                        <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-gray-700">
                          <Icon className="w-3 h-3" />
                        </div>
                        {item.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} AKitchenAI. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <button onClick={() => handleNavigation('/privacy')} className="hover:text-white transition">
                  Privacy
                </button>
                <button onClick={() => handleNavigation('/terms')} className="hover:text-white transition">
                  Terms
                </button>
                <button onClick={() => handleNavigation('/cookies')} className="hover:text-white transition">
                  Cookies
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;