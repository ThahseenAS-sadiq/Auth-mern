import React from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import { assets } from "../assets/assets";

const Home = () => {
  return (
     <div className="relative min-h-screen overflow-hidden">
      
      {/* Background Image */}
      <img
        src={assets.netflix_bg_image}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      {/* Content */}
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Navbar />
        <Header />
      </div>

    </div>
  )
}

export default Home;