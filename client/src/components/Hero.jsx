import React from "react";
import { assets } from "../assets/assets";

const Hero = () => {
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
          Enter ingredients you have and get AI create the perfect recipe for
          you.
        </p>
      </div>
      <div className="w-full h-[80vh] lg:h-[100vh] flex items-end">
      <img
        src={assets.hero}
        alt="Hero image"
        className="w-full h-full object-cover transition-all duration-1000 
        ease-in-out
        animate-slideUp pointer-events-none select-none"
        />
        </div>

      {/* Add CSS animations */}
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

        .hover\:scale-105,
        .hover\:scale-110,
        .hover\:text-gray-700,
        .hover\:opacity-90 {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 300ms;
        }
      `}</style>
    </div>
  );
};

export default Hero;
