// client/src/components/StaticPageLayout.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const StaticPageLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff7f8] to-white">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#f6a7a8] to-[#f8c6c7] px-6 md:px-10 py-10">
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="text-white/90 mt-3 max-w-3xl text-base md:text-lg">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="px-6 md:px-10 py-10">{children}</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StaticPageLayout;