import React from "react";
import { Brain, ShoppingCart, CalendarDays, Search } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Recipe Generator",
    description:
      "Enter ingredients you already have and let AI generate delicious recipes instantly.",
  },
  {
    icon: ShoppingCart,
    title: "Smart Grocery List",
    description:
      "Automatically create grocery lists from recipes so you never miss any ingredient.",
  },
  {
    icon: CalendarDays,
    title: "Meal Planner",
    description:
      "Plan your weekly meals effortlessly with AI-powered suggestions.",
  },
  {
    icon: Search,
    title: "Smart Recipe Search",
    description:
      "Search recipes by ingredients, cuisine, diet preference, or cooking time.",
  },
];

const Features = () => {
  return (
    <section className="w-full py-24 px-6 md:px-12">

      {/* Section Heading */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold">
          Powerful Features for Smart Cooking
        </h2>

        <p className="mt-4 text-gray-600 text-lg">
          Discover how AKitchen AI helps you cook smarter, save time,
          and create amazing meals effortlessly.
        </p>
      </div>

      {/* Features Grid */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div
              key={index}
              className="flex flex-col items-center text-center group"
            >

              {/* Icon */}
              <div className="w-16 h-16 flex items-center justify-center 
              rounded-xl border border-gray-200 
              group-hover:border-orange-500 transition">

                <Icon size={28} className="text-gray-700 group-hover:text-orange-500 transition" />

              </div>

              {/* Title */}
              <h3 className="mt-6 text-xl font-semibold">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>

            </div>
          );
        })}

      </div>

    </section>
  );
};

export default Features;