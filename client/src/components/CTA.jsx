import React from "react";

const CTA = () => {
  return (
    <section className="w-full py-24 px-6 md:px-12 bg-[#fed348]">

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

        {/* Left Content */}
        <div className="text-center md:text-left max-w-xl">

          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Start Cooking Smarter with AI
          </h2>

          <p className="mt-4 text-gray-800 text-lg">
            Discover personalized recipes, plan your meals effortlessly,
            and turn the ingredients in your kitchen into delicious dishes.
          </p>

        </div>

        {/* CTA Button */}
        <div className="flex justify-center md:justify-end">

          <button
            className="px-8 py-4 bg-black text-white text-lg font-medium 
            rounded-xl hover:bg-gray-900 transition duration-300 
            shadow-lg hover:scale-105"
          >
            Get Started
          </button>

        </div>

      </div>

    </section>
  );
};

export default CTA;