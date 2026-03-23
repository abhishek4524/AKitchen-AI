import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import AIRecipe from "./pages/AIRecipe";
import ExplorePage from "./pages/Explore";
import GroceryPage from "./pages/GroceryPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/Login";
import Signup from "./pages/Signup";
import MealPlanner from "./pages/MealPlanner";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import RecipeDetails from "./pages/RecipeDetails";
import SavedRecipes from "./pages/SavedRecipes";
import CreatedRecipes from "./pages/CreatedRecipes";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import HelpCenter from "./pages/HelpCenter";
import Contact from "./pages/Contact";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/ai-recipe" element={<AIRecipe />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/grocery" element={<GroceryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage />} />
        <Route path="/meal-planner" element={<MealPlanner />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/saved-recipe" element={<SavedRecipes />} />
        <Route path="/created-recipe" element={<CreatedRecipes />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
};

export default App;
