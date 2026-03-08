import React from "react";
import { Facebook, Instagram, Twitter, Github } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-[#017c45] text-gray-100 px-6 md:px-12 py-16">

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold">
            AKitchen<span className="text-orange-500">AI</span>
          </h2>

          <p className="mt-4 text-sm text-gray-200 leading-relaxed">
            Cook smarter with AI. Discover recipes based on ingredients
            you already have and transform your kitchen experience.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>

          <ul className="space-y-2 text-gray-200">

            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>

            <li>
              <Link to="/ai-recipe" className="hover:text-white transition">
                AI Recipe
              </Link>
            </li>

            <li>
              <Link to="/explore" className="hover:text-white transition">
                Explore Recipes
              </Link>
            </li>

            <li>
              <Link to="/about" className="hover:text-white transition">
                About
              </Link>
            </li>

          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Resources</h3>

          <ul className="space-y-2 text-gray-200">

            <li className="hover:text-white cursor-pointer transition">
              Privacy Policy
            </li>

            <li className="hover:text-white cursor-pointer transition">
              Terms & Conditions
            </li>

            <li className="hover:text-white cursor-pointer transition">
              Help Center
            </li>

            <li className="hover:text-white cursor-pointer transition">
              Contact
            </li>

          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>

          <div className="flex gap-4">

            <a
              href="#"
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              <Facebook size={20} />
            </a>

            <a
              href="#"
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              <Instagram size={20} />
            </a>

            <a
              href="#"
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              <Twitter size={20} />
            </a>

            <a
              href="#"
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              <Github size={20} />
            </a>

          </div>

        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-white/20 mt-12 pt-6 text-center text-sm text-gray-200">
        © {new Date().getFullYear()} AKitchen AI. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;