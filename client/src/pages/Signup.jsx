import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  Mail, 
  Lock, 
  User,
  Eye, 
  EyeOff, 
  Sparkles,
  ChefHat,
  AlertCircle,
  CheckCircle,
  Github,
  Facebook,
  ArrowRight,
  Loader2,
  Smartphone,
  Calendar,
  Utensils,
  Heart,
  Bell
} from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password strength checker
  useEffect(() => {
    let strength = 0;
    const password = formData.password;
    
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[$@#&!]+/)) strength += 1;
    
    setPasswordStrength(strength);
  }, [formData.password]);

  // Form validation
  useEffect(() => {
    const newErrors = {};
    
    // Name validation
    if (touched.name) {
      if (!formData.name) {
        newErrors.name = "Name is required";
      } else if (formData.name.length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }
    }
    
    // Email validation
    if (touched.email) {
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
    }
    
    // Password validation
    if (touched.password) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (passwordStrength < 3) {
        newErrors.password = "Password is too weak";
      }
    }
    
    // Confirm password validation
    if (touched.confirmPassword) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    // Terms validation
    if (touched.acceptTerms && !formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }
    
    setErrors(newErrors);
  }, [formData, touched, passwordStrength]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      acceptTerms: true
    });
    
    // Check if there are any errors
    if (Object.keys(errors).length > 0 || !formData.acceptTerms) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Signup data:', formData);
      
      // Show success message
      setSignupSuccess(true);
      
      // Redirect to verification page after success
      setTimeout(() => {
        navigate('/verify-email', { state: { email: formData.email } });
      }, 1500);
      
    } catch (error) {
      console.error('Signup failed:', error);
      setErrors({ general: 'Signup failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    console.log(`Signing up with ${provider}`);
    // Implement social signup logic here
  };

  // Password strength indicator
  const getStrengthColor = () => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];
    return colors[passwordStrength - 1] || 'bg-gray-200';
  };

  const getStrengthText = () => {
    const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return texts[passwordStrength - 1] || 'Enter password';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Navbar />

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Side - Hero Content */}
            <div className="hidden lg:block space-y-8 sticky top-24">
              <div className="relative">
                {/* Animated background elements */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000" />
                
                <div className="relative">
                  <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-6">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Join 50,000+ happy cooks</span>
                  </div>
                  
                  <h1 className="text-5xl font-bold text-gray-900 mb-6">
                    Start Your
                    <span className="block bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent mt-2">
                      Culinary Journey
                    </span>
                  </h1>
                  
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Create your free account and unlock a world of AI-powered recipes, smart grocery lists, and personalized cooking experiences.
                  </p>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Utensils, text: "Personalized Recipes", color: "purple" },
                  { icon: Smartphone, text: "Smart Grocery Lists", color: "orange" },
                  { icon: Heart, text: "Save Favorites", color: "pink" },
                  { icon: Bell, text: "Meal Reminders", color: "green" }
                ].map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                      <div className={`w-10 h-10 bg-${benefit.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                        <Icon className={`w-5 h-5 text-${benefit.color}-600`} />
                      </div>
                      <p className="font-medium text-gray-800">{benefit.text}</p>
                    </div>
                  );
                })}
              </div>

              {/* Testimonial */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">
                  "AKitchenAI has completely transformed how I cook. The personalized recipes are amazing!"
                </p>
                <div className="flex items-center gap-3">
                  <img 
                    src="https://ui-avatars.com/api/?name=Sarah+Johnson&background=8B5CF6&color=fff&bold=true" 
                    alt="Sarah Johnson"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">Home Cook</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Signup Card */}
            <div className="relative">
              {/* Success Message */}
              {signupSuccess && (
                <div className="absolute -top-20 left-0 right-0 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slideDown z-10">
                  <CheckCircle className="w-6 h-6" />
                  <span>Account created! Redirecting to verification...</span>
                </div>
              )}

              {/* Signup Card */}
              <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-10 border border-white/20">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full mb-6 shadow-lg">
                    <ChefHat className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
                  <p className="text-gray-500">Get started with your free account</p>
                </div>

                {/* General Error Message */}
                {errors.general && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errors.general}</span>
                  </div>
                )}

                <form onSubmit={handleSignup} className="space-y-5">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className={`h-5 w-5 ${errors.name && touched.name ? 'text-red-400' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={() => handleBlur('name')}
                        placeholder="Enter your full name"
                        className={`block w-full pl-10 pr-3 py-3 border ${
                          errors.name && touched.name 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                        } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition`}
                      />
                    </div>
                    {errors.name && touched.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className={`h-5 w-5 ${errors.email && touched.email ? 'text-red-400' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur('email')}
                        placeholder="Enter your email"
                        className={`block w-full pl-10 pr-3 py-3 border ${
                          errors.email && touched.email 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                        } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition`}
                      />
                    </div>
                    {errors.email && touched.email && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className={`h-5 w-5 ${errors.password && touched.password ? 'text-red-400' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={() => handleBlur('password')}
                        placeholder="Create a password"
                        className={`block w-full pl-10 pr-10 py-3 border ${
                          errors.password && touched.password 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                        } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getStrengthColor()} transition-all duration-300`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600">
                            {getStrengthText()}
                          </span>
                        </div>
                        <ul className="text-xs text-gray-500 grid grid-cols-2 gap-1 mt-2">
                          <li className="flex items-center gap-1">
                            <CheckCircle className={`w-3 h-3 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                            Min 8 characters
                          </li>
                          <li className="flex items-center gap-1">
                            <CheckCircle className={`w-3 h-3 ${/[a-z]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                            Lowercase
                          </li>
                          <li className="flex items-center gap-1">
                            <CheckCircle className={`w-3 h-3 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                            Uppercase
                          </li>
                          <li className="flex items-center gap-1">
                            <CheckCircle className={`w-3 h-3 ${/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                            Number
                          </li>
                        </ul>
                      </div>
                    )}
                    
                    {errors.password && touched.password && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className={`h-5 w-5 ${errors.confirmPassword && touched.confirmPassword ? 'text-red-400' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={() => handleBlur('confirmPassword')}
                        placeholder="Confirm your password"
                        className={`block w-full pl-10 pr-10 py-3 border ${
                          errors.confirmPassword && touched.confirmPassword 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                        } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && touched.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        name="acceptTerms"
                        type="checkbox"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        onBlur={() => handleBlur('acceptTerms')}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                      />
                    </div>
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                      I agree to the{" "}
                      <Link to="/terms" className="text-purple-600 hover:text-purple-500 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-purple-600 hover:text-purple-500 hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {errors.acceptTerms && touched.acceptTerms && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.acceptTerms}
                    </p>
                  )}

                  {/* Signup Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Or sign up with</span>
                    </div>
                  </div>

                  {/* Social Signup Buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSocialSignup('google')}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition group"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialSignup('github')}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Github className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialSignup('facebook')}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Facebook className="w-5 h-5 text-blue-600" />
                    </button>
                  </div>

                  {/* Login Link */}
                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link 
                      to="/login" 
                      className="font-medium text-purple-600 hover:text-purple-500 hover:underline transition"
                    >
                      Sign in
                    </Link>
                  </p>
                </form>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <span>🔒 256-bit encryption</span>
                  <span>✓ GDPR compliant</span>
                  <span>🚫 No spam</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Star component for testimonials
const Star = (props) => (
  <svg 
    {...props}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export default Signup;