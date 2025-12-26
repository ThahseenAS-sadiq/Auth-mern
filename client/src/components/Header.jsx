import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContent } from '../context/AppContext';
import { useNavigate } from "react-router-dom";


const Header = () => {

  const { userData } = useContext(AppContent)
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-white '>

      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2' >Hey {userData ? userData.name : "there"}
        <img src={assets.hand_wave} alt="" className='w-8 aspect-square' />
      </h1>

      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our app</h2>
      <p className='mb-8 max-w-md' >Let's start with quick product tour and we will have you up and running in no time!</p>
      <button onClick={() => navigate("/login")} className='px-8 py-2.5 rounded bg-[#e50914] text-white font-medium border border-transparent transition-all duration-300 hover:bg-[#f6121d] hover:border-white hover:scale-[1.03] active:scale-100'
      >Get Started</button>
    </div>
  )
}

export default Header;