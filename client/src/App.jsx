import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Landing from './pages/Landing'
import AIRecipe from './pages/AIRecipe'
import ExplorePage from './pages/Explore'
import GroceryPage from './pages/GroceryPage'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/ai-recipe' element={<AIRecipe />} />
        <Route path='/explore' element={<ExplorePage />} />
        <Route path='/grocery' element={<GroceryPage />} />
      </Routes>
    </div>
  )
}

export default App