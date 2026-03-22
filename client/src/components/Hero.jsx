import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="w-full flex flex-col items-center pt-26 animate-fadeIn">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl fugaz-one-regular lg:w-1/2 md:w-3/4 sm:w-4/5 w-9/10 text-center 
                         transition-all duration-700 ease-in-out hover:scale-105"
        >
          Cook Amazing Recipes with AI
        </h1>

        <p
          className="text-center mt-3 transition-all duration-500 
                         delay-200 hover:text-gray-700 text-base sm:text-lg md:text-xl"
        >
          Enter ingredients you have and get AI create the perfect recipe for you.
        </p>

        {/* 🔥 CTA BUTTON */}
        <button
          onClick={() => navigate("/ai-recipe")}
          className="mt-6 px-6 py-3 bg-black text-white rounded-full text-lg font-semibold 
          hover:scale-105 hover:opacity-90 transition-all duration-300 shadow-lg"
        >
          Generate Recipe ⚡
        </button>

        {/* 🔥 Secondary CTA (optional but powerful) */}
        <p className="mt-2 text-sm text-gray-500">
          Try 1 recipe for free
        </p>
      </div>

      <div className="w-full h-[80vh] lg:h-[100vh] flex items-end">
        <img
          src={assets.hero}
          alt="Hero image"
          className="w-full h-full object-cover transition-all duration-1000 
          ease-in-out animate-slideUp pointer-events-none select-none"
        />
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 1.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Hero;