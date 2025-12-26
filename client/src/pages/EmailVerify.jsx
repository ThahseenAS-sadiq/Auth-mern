import React, { useContext, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EmailVerify = () => {

  //used for onSubmitHandler
  axios.defaults.withCredentials = true;
  const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContent)
  const navigate = useNavigate()

  const inputRefs = React.useRef([])

  //index moves forward after given
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  //index automatically backward after delete
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  //To submitting OTP form by click submit button
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')

      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp })
      if (data.success) {
        toast.success(data.message)
        getUserData()
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  //paste the otp to clipboard paste ones all the otp
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    paste.split('').forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
    inputRefs.current[Math.min(paste.length, 5)]?.focus();
  };

  //After OTP verified it automatically redirect to home page
  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate('/')
  }, [isLoggedin, userData])

  return (
    <div className='relative flex items-center justify-center min-h-screen overflow-hidden ' >
      <img
        src={assets.netflix_bg_image}   // import or reference from assets
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      <img onClick={() => navigate('/')} src={assets.logo_net} alt=""
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursur-pointer' />

      <form className='bg-slate-900 p-8 rounded-lg' onSubmit={onSubmitHandler} >
        <h1 className='text-white text-2xl font-semibold text-center mb-4' >Email Verify OTP</h1>
        <p className='text-center mb-6 text-indigo-300' >Enter the 6-digit code sent to your email id.</p>

        <div className='flex justify-between mb-8' onPaste={handlePaste} >
          {Array(6).fill(0).map((_, index) => (
            <input type="text" maxLength='1' key={index} required className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
              ref={e => inputRefs.current[index] = e}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)} />
          ))}
        </div>
        <button className='w-full py-2.5 rounded-full bg-linear-to-r from-red-500 to-red-900 text-white font-medium  border border-transparent transition-all duration-300 hover:bg-[#f6121d] hover:border-white hover:scale-[1.03] active:scale-100' >Verify email</button>
      </form>
    </div>
  )
}

export default EmailVerify;