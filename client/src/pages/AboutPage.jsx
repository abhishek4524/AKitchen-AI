import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Wand, ShoppingCart, Heart, Zap, Check, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Recipes',
      description: 'Turn ingredients into meals instantly. Our AI understands your taste and dietary needs.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Wand,
      title: 'Effortless Cooking',
      description: 'Step-by-step guidance, from preparation to plating. No more guesswork.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: ShoppingCart,
      title: 'Smart Grocery Lists',
      description: 'Auto-generate shopping lists from recipes, with price estimates and category sorting.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Heart,
      title: 'Personalized Experience',
      description: 'Save favorites, track preferences, and get recommendations tailored just for you.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Enter Ingredients',
      description: 'Type what you have in your kitchen or pantry.'
    },
    {
      number: '02',
      title: 'Get AI Recipe',
      description: 'Receive a complete recipe with instructions, nutrition, and timing.'
    },
    {
      number: '03',
      title: 'Cook & Enjoy',
      description: 'Follow the steps, share, and add ingredients to your grocery list.'
    }
  ];

  const problems = [
    {
      pain: 'Wasted ingredients & limited ideas',
      solution: 'Use up what you have with creative recipes tailored to your ingredients.'
    },
    {
      pain: 'Time-consuming meal planning',
      solution: 'Let AI plan meals and generate grocery lists in seconds.'
    },
    {
      pain: 'Dietary restrictions overwhelm',
      solution: 'Filter by diet (vegan, keto, gluten-free) and get safe suggestions.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 bg-gradient-to-br from-purple-50 via-white to-orange-50">
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm mb-8">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">AI-Powered Kitchen Assistant</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
            Your AI Kitchen Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Generate recipes from ingredients, plan meals, and manage groceries – all with the power of AI.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/ai-recipe')}
              className="group px-8 py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              Try Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            {!token ? <button
              onClick={() => navigate('/signup')}
              className="px-8 py-3 bg-white text-gray-700 rounded-full font-semibold border border-gray-300 shadow-sm hover:shadow-md transition-all hover:border-purple-300 hover:text-purple-600"
            >
              Sign Up
            </button> : <div></div>}
          </div>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              From Chaos to Clarity
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cooking should be joyful, not stressful. We eliminate the common pain points.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((item, idx) => (
              <div key={idx} className="group bg-gray-50 rounded-2xl p-8 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="text-red-500 font-semibold text-sm uppercase tracking-wider mb-3">❌ Pain Point</div>
                <p className="text-gray-800 text-lg font-medium mb-6">{item.pain}</p>
                <div className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-3">✓ Solution</div>
                <p className="text-gray-600 leading-relaxed">{item.solution}</p>
                <div className="mt-6 h-1 w-12 bg-purple-200 group-hover:w-full transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Designed for Modern Cooks
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to cook smarter, faster, and more deliciously.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-5 shadow-md group-hover:shadow-lg transition-all`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to turn your ingredients into a delicious meal.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center relative">
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent mb-4">
                  {step.number}
                </div>
                <div className="h-px w-12 bg-gray-200 mx-auto my-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-24 bg-gradient-to-r from-purple-900 to-orange-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Our Mission</h2>
          <p className="text-xl mb-12 leading-relaxed max-w-2xl mx-auto">
            To empower everyone to cook delicious, healthy meals with confidence, using AI as your trusted kitchen companion.
          </p>
          <div className="w-24 h-1 bg-white/30 mx-auto my-8" />
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Our Vision</h2>
          <p className="text-xl leading-relaxed max-w-2xl mx-auto">
            A world where cooking is effortless, sustainable, and universally accessible.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Cook Smarter?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of home cooks who are already saving time and enjoying delicious meals.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/ai-recipe')}
              className="group px-8 py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              Try Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            {!token ? <button
              onClick={() => navigate('/signup')}
              className="px-8 py-3 bg-white text-gray-700 rounded-full font-semibold border border-gray-300 shadow-sm hover:shadow-md transition-all hover:border-purple-300 hover:text-purple-600"
            >
              Sign Up
            </button> : <div></div>}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;