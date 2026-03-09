import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  Mail, 
  Lock, 
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
  Key
} from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Form validation
  useEffect(() => {
    const newErrors = {};
    
    if (touched.email) {
      if (!email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Email is invalid";
      }
    }
    
    if (touched.password) {
      if (!password) {
        newErrors.password = "Password is required";
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }
    
    setErrors(newErrors);
  }, [email, password, touched]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      email: true,
      password: true
    });
    
    // Check if there are any errors
    if (Object.keys(errors).length > 0 || !email || !password) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log({
        email,
        password,
        rememberMe
      });
      
      // Show success message
      setLoginSuccess(true);
      
      // Redirect to dashboard after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    // Implement social login logic here
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  // Demo credentials for quick login
  const fillDemoCredentials = () => {
    setEmail("demo@akitchenai.com");
    setPassword("demo123");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      <Navbar />

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Hero Content */}
            <div className="hidden lg:block space-y-8">
              <div className="relative">
                {/* Animated background elements */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000" />
                
                <div className="relative">
                  <h1 className="text-5xl font-bold text-gray-900 mb-6">
                    Welcome Back to
                    <span className="block bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent mt-2">
                      AKitchenAI
                    </span>
                  </h1>
                  
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Your AI-powered kitchen companion is waiting. Login to access personalized recipes, smart grocery lists, and more.
                  </p>
                </div>
              </div>

              {/* Feature List */}
              <div className="space-y-4">
                {[
                  { icon: Sparkles, text: "Generate AI-powered recipes from your ingredients" },
                  { icon: ChefHat, text: "Get personalized meal recommendations" },
                  { icon: Smartphone, text: "Sync your grocery lists across devices" },
                  { icon: Key, text: "Access your saved recipes anytime" }
                ].map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-center gap-4 group">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <Icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <span className="text-gray-700">{feature.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">50K+</div>
                  <div className="text-sm text-gray-500">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">100K+</div>
                  <div className="text-sm text-gray-500">Recipes Made</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">4.9</div>
                  <div className="text-sm text-gray-500">User Rating</div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Card */}
            <div className="relative">
              {/* Success Message */}
              {loginSuccess && (
                <div className="absolute -top-20 left-0 right-0 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slideDown">
                  <CheckCircle className="w-6 h-6" />
                  <span>Login successful! Redirecting to dashboard...</span>
                </div>
              )}

              {/* Login Card */}
              <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-10 border border-white/20">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full mb-6 shadow-lg">
                    <ChefHat className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
                  <p className="text-gray-500">Please enter your details to sign in</p>
                </div>

                {/* Demo Credentials Button */}
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="w-full mb-6 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition flex items-center justify-center gap-2 text-sm border border-purple-200"
                >
                  <Sparkles className="w-4 h-4" />
                  Use Demo Credentials
                </button>

                {/* General Error Message */}
                {errors.general && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errors.general}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => handleBlur('password')}
                        placeholder="Enter your password"
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
                    {errors.password && touched.password && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                        Remember me
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate('/forgot-password')}
                      className="text-sm font-medium text-purple-600 hover:text-purple-500 hover:underline transition"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
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
                      <span className="px-4 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('google')}
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
                      onClick={() => handleSocialLogin('github')}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Github className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('facebook')}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Facebook className="w-5 h-5 text-blue-600" />
                    </button>
                  </div>

                  {/* Sign Up Link */}
                  <p className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link 
                      to="/signup" 
                      className="font-medium text-purple-600 hover:text-purple-500 hover:underline transition"
                    >
                      Sign up for free
                    </Link>
                  </p>
                </form>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <span>🔒 256-bit encryption</span>
                  <span>✓ GDPR compliant</span>
                  <span>🛡️ 2FA available</span>
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

export default LoginPage;