import React from 'react';

/**
 * Premium visual card for a cuisine.
 * Props:
 *  - cuisine: name of the cuisine
 *  - image: background image URL
 *  - count: number of recipes (optional)
 *  - onClick: click handler (entire card is clickable)
 *  - className: additional Tailwind classes for layout (e.g., grid span)
 */
const CuisineCard = ({ cuisine, image, count, onClick, className = '' }) => {
  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300 ${className}`}
    >
      {/* Background image */}
      <img
        src={image}
        alt={cuisine}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent group-hover:from-black/50 transition-colors duration-300" />
      {/* Text content & CTA */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
        <h3 className="text-2xl font-semibold drop-shadow-sm">{cuisine}</h3>
        {count !== undefined && (
          <p className="text-sm opacity-90 mb-2">{count} recipes</p>
        )}
        <button className="self-start opacity-0 group-hover:opacity-100 bg-white/20 backdrop-blur-sm text-sm font-medium px-3 py-1 rounded-md transition-opacity duration-300">
          Explore →
        </button>
      </div>
    </div>
  );

};

export default CuisineCard;
