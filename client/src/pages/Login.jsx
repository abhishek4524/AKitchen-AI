import React from "react";
import { motion } from "framer-motion";

// Reuse the same images from grocery page for background
const foodImages = {
  vegetables: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  fruits: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  spices: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
};

function Login() {
  const googleLogin = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6a7a8] to-[#f6a7a8] relative overflow-hidden">
      {/* Background decorative images – similar to grocery page */}
      <div className="absolute inset-0 opacity-15">
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute left-0 top-10 w-96 h-96"
        >
          <img src={foodImages.vegetables} alt="vegetables" className="w-full h-full object-cover rounded-full opacity-30" />
        </motion.div>
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
          className="absolute right-0 bottom-10 w-96 h-96"
        >
          <img src={foodImages.fruits} alt="fruits" className="w-full h-full object-cover rounded-full opacity-30" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 30, repeat: Infinity, repeatType: "reverse" }}
          className="absolute left-1/4 top-1/4 w-64 h-64"
        >
          <img src={foodImages.spices} alt="spices" className="w-full h-full object-cover rounded-full opacity-20" />
        </motion.div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{ y: [null, -30, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="max-w-md w-full"
        >
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-block mb-4"
              >
                <span className="bg-white/30 backdrop-blur-md px-6 py-2 rounded-full  font-semibold text-lg">
                  AKitchen <span className="text-orange-500">AI</span>
                </span>
              </motion.div>
              <h2 className="text-4xl font-bold text-white mb-2">Welcome Back!</h2>
              <p className="text-white/80">Sign in to generate new recipes</p>
            </div>

            <button
              onClick={googleLogin}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 group"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
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
              Sign in with Google
            </button>

            <div className="mt-6 text-center text-white/60 text-sm">
              By signing in, you agree to our Terms of Service
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;