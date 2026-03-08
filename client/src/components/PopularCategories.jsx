import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { assets } from "../assets/assets";

import "swiper/css";
import "swiper/css/navigation";

const categories = [
  { name: "Healthy", image: assets.healthy },
  { name: "Indian", image: assets.indian },
  { name: "Quick & Easy", image: assets.quick },
  { name: "Vegetarian", image: assets.veg },
  { name: "Chicken", image: assets.chicken },
  { name: "Pasta", image: assets.pasta },
  { name: "Desserts", image: assets.dessert },
  { name: "Dinner", image: assets.dinner },
  { name: "Breakfast", image: assets.breakfast },
  { name: "Vegan", image: assets.vegan },
];

const Categories = () => {
  return (
    <div className="w-full py-16 px-6 md:px-12">

      {/* Section Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        What Are You Craving Today?
      </h2>

      {/* Slider */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={2}
        navigation
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
      >

        {categories.map((cat, index) => (
          <SwiperSlide key={index}>
            
            <div className="flex flex-col items-center cursor-pointer group">

              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full rounded-xl object-cover 
                transition-transform duration-300 group-hover:scale-110"
              />

              <p className="mt-3 text-lg font-medium">
                {cat.name}
              </p>

            </div>

          </SwiperSlide>
        ))}

      </Swiper>
    </div>
  );
};

export default Categories;