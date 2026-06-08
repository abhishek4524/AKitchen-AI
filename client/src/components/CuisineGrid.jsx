import React, { useEffect, useState } from 'react';
import CuisineCard from './CuisineCard';
import { motion } from 'framer-motion';

// Example static list of cuisines; replace with API call if available
const defaultCuisines = [
  { name: 'North Indian', image: 'https://images.unsplash.com/photo-1513104892584-9c9e84cd58d8?auto=format&fit=crop&w=800&q=80', count: 120 },
  { name: 'South Indian', image: 'https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=800&q=80', count: 95 },
  { name: 'Chinese', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80', count: 80 },
  { name: 'Italian', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80', count: 95 },
  { name: 'Mexican', image: 'https://images.unsplash.com/photo-1516684669134-99c7f8c07c9d?auto=format&fit=crop&w=800&q=80', count: 70 },
  { name: 'Japanese', image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc2?auto=format&fit=crop&w=800&q=80', count: 55 },
  { name: 'Thai', image: 'https://images.unsplash.com/photo-1565299598629-4c00b09bd7f8?auto=format&fit=crop&w=800&q=80', count: 60 },
  { name: 'Korean', image: 'https://images.unsplash.com/photo-1586194975139-2c2601cfa7ba?auto=format&fit=crop&w=800&q=80', count: 45 },
  { name: 'Mediterranean', image: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=800&q=80', count: 70 },
];

const CuisineGrid = ({ onSelectCuisine }) => {
  const [cuisines, setCuisines] = useState([]);

  useEffect(() => {
    // In a real app replace with API call
    setCuisines(defaultCuisines);
  }, []);

  const handleClick = (cuisine) => {
    if (onSelectCuisine) onSelectCuisine(cuisine.name);
  };

  // Render cards; first card gets featured styling on larger screens
  const renderCards = () =>
    cuisines.map((c, idx) => (
      <CuisineCard
        key={c.name}
        cuisine={c.name}
        image={c.image}
        count={c.count}
        onClick={() => handleClick(c)}
        className={idx === 0 ? 'lg:col-span-2 lg:row-span-2 h-96' : 'h-72'}
      />
    ));

  return (
    <section className="mt-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-7xl mx-auto"
      >
        {/* Hero Title */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-amber-400 mb-2">
          Explore World Cuisines
        </h2>
        <p className="text-center text-gray-300 mb-8">
          Discover thousands of recipes from around the globe
        </p>
        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-4 gap-6">
          {renderCards()}
        </div>
        {/* Mobile Horizontal Scroll */}
        <div className="lg:hidden mt-6 overflow-x-auto whitespace-nowrap">
          {cuisines.map((c, idx) => (
            <div key={c.name} className="inline-block mr-4 w-72">
              <CuisineCard
                cuisine={c.name}
                image={c.image}
                count={c.count}
                onClick={() => handleClick(c)}
                className="h-72"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default CuisineGrid;
