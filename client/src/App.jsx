import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Landing from './pages/Landing'
import AIRecipe from './pages/AIRecipe'
import ExplorePage from './pages/Explore'
import GroceryPage from './pages/GroceryPage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/Login'
import Signup from './pages/Signup'
import MealPlanner from './pages/MealPlanner'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import RecipeDetails from './pages/RecipeDetails'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/ai-recipe' element={<AIRecipe />} />
        <Route path='/explore' element={<ExplorePage />} />
        <Route path='/grocery' element={<GroceryPage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/meal-planner' element={<MealPlanner />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='profile' element={<Profile />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
      </Routes>
    </div>
  )
}

export default App