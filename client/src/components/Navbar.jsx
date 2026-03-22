import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, X, User } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);

  // Keep token in sync if another tab updates it
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token") || "");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // If the auth callback includes a ?token=..., store it and remove it from the URL
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const urlToken = query.get("token");
    if (urlToken) {
      localStorage.setItem("token", urlToken);
      setToken(urlToken);
      query.delete("token");
      const cleanUrl = `${window.location.pathname}${query.toString() ? `?${query.toString()}` : ""}`;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

useEffect(() => {
  const fetchUser = async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        "http://localhost:5000/api/user/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  fetchUser();
}, [token]);
  
  return (
    <nav
      className={`w-full px-10 py-4 flex justify-between fixed h-20 items-center z-50
    ${scrolled ? "bg-white shadow-md" : "bg-transparent"}`}
    >
      {/* Left Menu */}
      <div className="md:flex items-center gap-8 text-lg hidden">
        <Link to="/ai-recipe" className="hover:underline transition">
          AI Recipe
        </Link>

        <Link to="/explore" className="hover:underline transition">
          Explore
        </Link>

      </div>

      {/* Logo */}
      <div className="text-2xl font-bold text-center">
        <Link to="/" className="">
          AKitchen<span className="text-orange-500">AI</span>
        </Link>
      </div>

      {/* Right Menu */}
      <div className="md:flex items-center gap-8 text-lg hidden">
        {/* <Link to="/meal-planner" className="hover:underline transition">
          Meal Planner
        </Link> */}
        <Link to="/grocery" className="hover:underline transition">
          Grocery
        </Link>
        <Link to="/about" className="hover:underline transition">
          About
        </Link>


        {token ? (
          <Link to="/profile">
            {user?.picture ? (
              <img
                src={user.picture}
                alt="profile"
                className="w-9 h-9 rounded-full object-cover border cursor-pointer"
              />
            ) : (
              <User className="w-8 h-8 cursor-pointer" />
            )}
          </Link>
        ) : (
          <Link
            to="/login"
            className="border-2 px-4 py-1 rounded-lg hover:text-white hover:bg-black hover:border-black transition"
          >
            Login
          </Link>
        )}
      </div>
      <div className="block md:hidden">
        <button
          className="hover:scale-105 transition cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center gap-6 py-6 md:hidden text-lg z-50">
          <Link to="/ai-recipe" onClick={() => setMenuOpen(false)}>
            AI Recipe
          </Link>

          <Link to="/explore" onClick={() => setMenuOpen(false)}>
            Explore
          </Link>

          <Link to="/grocery" onClick={() => setMenuOpen(false)}>
            Grocery
          </Link>

          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>

          {token ? (
            <Link to="/profile">
              <User className="w-8 h-8 cursor-pointer" />
            </Link>
          ) : (
            <Link to="/login" className="border px-4 py-1 rounded-lg">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
