import React from "react";
import { Search, Sparkles, Utensils } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Enter Your Ingredients",
    description:
      "Type the ingredients you already have in your kitchen.",
  },
  {
    icon: Sparkles,
    title: "AI Generates Recipes",
    description:
      "Our AI instantly creates delicious recipes based on your ingredients.",
  },
  {
    icon: Utensils,
    title: "Cook & Enjoy",
    description:
      "Follow the simple steps and enjoy your homemade meal.",
  },
];

const Works = () => {
  return (
    <section className="w-full py-24 px-6 md:px-12 bg-[#CBB9DF]">

      {/* Section Heading */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold">
          How AKitchen AI Works
        </h2>

        <p className="mt-4 text-gray-700 text-lg">
          Cooking delicious meals has never been easier. Just follow these
          simple steps.
        </p>
      </div>

      {/* Steps */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">

        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md 
              hover:shadow-xl transition duration-300 text-center relative"
            >

              {/* Step Number */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 
              bg-black text-white w-8 h-8 rounded-full flex items-center 
              justify-center text-sm font-semibold">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="w-16 h-16 mx-auto flex items-center justify-center 
              rounded-xl bg-gray-100 mt-4">
                <Icon size={28} />
              </div>

              {/* Title */}
              <h3 className="mt-6 text-xl font-semibold">
                {step.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-gray-600 text-sm">
                {step.description}
              </p>

            </div>
          );
        })}

      </div>

    </section>
  );
};

export default Works;