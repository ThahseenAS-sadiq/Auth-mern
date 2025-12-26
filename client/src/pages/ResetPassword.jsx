import React, { useState, useEffect, useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState('');
  const [otp, setOtp] = useState(0);
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);

  const { backendUrl, isLoggedin, userData } = useContext(AppContent)
  axios.defaults.withCredentials = true;

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

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email })
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && setIsEmailSent(true)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value)
    setOtp(otpArray.join(''))
    setIsOtpSubmited(true)
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword })
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }


  return (
    <div className='relative flex items-center justify-center min-h-screen overflow-hidden '>
      <img
        src={assets.netflix_bg_image}   // make sure this exists in assets
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      <img onClick={() => navigate('/')} src={assets.logo_net} alt="logo_img"
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursur-pointer' />

      {/* email id form */}

      {!isEmailSent &&
        <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg' >
          <h1 className='text-white text-2xl font-semibold text-center mb-4' >Reset Password</h1>
          <p className='text-center mb-6 text-indigo-300' >Enter your registered email address</p>

          <div className='flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" className='w-3 h-3' />
            <input type="email" placeholder='Email id' value={email} onChange={e => setEmail(e.target.value)}
              className='bg-transparent outline-none text-white w-full' required />
          </div>
          <button className='w-full py-2.5 rounded-full bg-linear-to-r from-red-500 to-red-900 text-white font-medium  border border-transparent transition-all duration-300 hover:bg-[#f6121d] hover:border-white hover:scale-[1.03] active:scale-100' >Submit</button>
        </form>
      }


      {/* otp input form */}

      {!isOtpSubmited && isEmailSent &&
        <form onSubmit={onSubmitOTP} className='bg-slate-900 p-8 rounded-lg'  >
          <h1 className='text-white text-2xl font-semibold text-center mb-4' >Reset Password OTP</h1>
          <p className='text-center mb-6 text-indigo-300' >Enter the 6-digit code sent to your email id.</p>

          <div className='flex justify-between mb-8' onPaste={handlePaste} >
            {Array(6).fill(0).map((_, index) => (
              <input type="text" maxLength='1' key={index} required className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)} />
            ))}
          </div>
          <button className='w-full py-2.5 rounded-full bg-linear-to-r from-red-500 to-red-900 text-white font-medium  border border-transparent transition-all duration-300 hover:bg-[#f6121d] hover:border-white hover:scale-[1.03] active:scale-100' >Submit</button>
        </form>
      }

      {/* enter new password */}

      {isOtpSubmited && isEmailSent &&
        <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4' >New Password</h1>
          <p className='text-center mb-6 text-indigo-300' >Enter the new password below</p>

          <div className='flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" className='w-3 h-3' />
            <input type="password" placeholder='Password' value={newPassword} onChange={e => setNewPassword(e.target.value)}
              className='bg-transparent outline-none text-white w-full' required />
          </div>
          <button className='w-full py-2.5 rounded-full bg-linear-to-r from-red-500 to-red-900 text-white font-medium  border border-transparent transition-all duration-300 hover:bg-[#f6121d] hover:border-white hover:scale-[1.03] active:scale-100' >Submit</button>
        </form>
      }

    </div>
  )
}

export default ResetPassword;