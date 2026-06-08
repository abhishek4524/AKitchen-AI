import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { CirclePlay, X } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);

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
        <div className="flex flex-col sm:flex-row gap-4 my-6 w-full sm:w-auto">
          <button
            onClick={() => navigate("/ai-recipe")}
            className="
              w-full sm:w-auto
              px-6 py-3
              bg-black text-white
              rounded-full
              text-base sm:text-lg
              font-semibold
              hover:scale-105 hover:opacity-90
              transition-all duration-300
              shadow-lg cursor-pointer
            "
          >
            Generate Recipe ⚡
          </button>

          <button
            onClick={() => setShowDemo(true)}
            className="
              w-full sm:w-auto
              px-6 py-3
              border-2 border-black
              text-black
              rounded-full
              text-base sm:text-lg
              font-semibold
              hover:scale-105 hover:opacity-90
              transition-all duration-300
              shadow-lg cursor-pointer
              flex items-center justify-center
            "
          >
            <CirclePlay className="w-5 h-5 mr-2" />
            Demo Video
          </button>
        </div>
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
{showDemo && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-70 z-50">
    <div className="relative w-full max-w-3xl p-4  rounded-lg">
      <button
        onClick={() => setShowDemo(false)}
        className="absolute top-[-10px] right-[-10px] text-gray-400 hover:text-gray-800"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="relative pt-[56.25%]">
        <iframe
          src="https://www.youtube.com/embed/COh9ylWomh8?si=2N8qv8WyRzX13dKH&autoplay=1"
          title="Demo Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        ></iframe>
      </div>
    </div>
  </div>
)}
</div>
  );
};

export default Hero;