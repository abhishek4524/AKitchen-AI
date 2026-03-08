import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import PopularCategories from '../components/PopularCategories'
import TrendingCategories from '../components/TrendingCategories'
import Features from '../components/Features'
import Works from '../components/Works'
import CTA from '../components/CTA'
import Footer from '../components/Footer'


const Landing = () => {
  return (
    <div>
      <div className='h-screen w-full bg-[#CBB9DF] '>
        <Navbar />
        <Hero />
        <PopularCategories />
        <TrendingCategories />
        <Features />
        <Works />
        <CTA />
        <Footer />
    </div>
    </div>
  )
}

export default Landing