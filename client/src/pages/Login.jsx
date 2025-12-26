import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

    const navigate = useNavigate();

    const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent)

    const [state, setState] = useState('Sign up')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();

            if (state === "Sign up") {
                const { data } = await axios.post(
                    backendUrl + "/api/auth/register",
                    { name, email, password }
                );

                if (data.success) {
                    toast.success("Account registered successfully. Please login ✅");
                    setName("");
                    setEmail("");
                    setPassword("");
                    setState("Login");
                } else {
                    toast.error(data.message);
                }

            } else {
                const { data } = await axios.post(
                    backendUrl + "/api/auth/login",
                    { email, password }
                );

                if (data.success) {
                    toast.success("Login successful 🎉");

                    localStorage.setItem("token", data.token);
                    axios.defaults.headers.common["Authorization"] =
                        `Bearer ${data.token}`;

                    setIsLoggedin(true);
                    await getUserData();
                    navigate("/");
                } else {
                    toast.error(data.message);
                }
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };



    return (
        <div className='relative flex items-center justify-center min-h-screen px-6 sm:px-0 overflow-hidden '>
            {/* Background Image */}
            <img
                src={assets.netflix_bg_image}   // make sure bg_img is in assets
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover -z-10"
            />
            <img onClick={() => navigate('/')} src={assets.logo_net} alt=""
                className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursur-pointer' />

            <div className='bg-slate-900 p-10 rounded-b-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>

                <h2 className='text-3xl font-semibold text-white text-center mb-3 '>{state === 'Sign up' ? 'Create account' : 'Login'}</h2>

                <p className='text-center text-sm mb-6' >{state === 'Sign up' ? 'Create your account' : 'Login to your account!'}</p>

                <form onSubmit={onSubmitHandler} className="w-full max-w-sm" >

                    {state === 'Sign up' && (
                        <div className="mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-full bg-[#333A5C]">
                            <img
                                src={assets.person_icon}
                                alt="User icon"
                                className="w-5 h-5"
                            />
                            <input
                                onChange={e => setName(e.target.value)}
                                value={name}
                                className="flex-1 bg-transparent border-none outline-none ring-0 focus:ring-0 focus:outline-none text-white placeholder-gray-300 appearance-none"
                                type="text"
                                placeholder="Full Name"
                                required
                            />
                        </div>
                    )}


                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-full bg-[#333A5C]">
                        <img
                            src={assets.mail_icon}
                            alt="Email icon"
                            className="w-5 h-5"
                        />
                        <input
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            className="flex-1 bg-transparent border-none outline-none ring-0 focus:ring-0 focus:outline-none text-white placeholder-gray-300 appearance-none"
                            type="email"
                            placeholder="Email ID"
                            required
                        />
                    </div>

                    <div className="mb-6 flex items-center gap-3 w-full px-5 py-3 rounded-full bg-[#333A5C]">
                        <img
                            src={assets.lock_icon}
                            alt="Password icon"
                            className="w-5 h-5"
                        />
                        <input
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            className="flex-1 bg-transparent border-none outline-none ring-0 focus:ring-0 focus:outline-none text-white placeholder-gray-300 appearance-none"
                            type="password"
                            placeholder="Password"
                            required
                        />
                    </div>

                    <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password?</p>

                    <button type='submit' className='w-full py-2.5 rounded-full bg-linear-to-r from-red-500 to-red-900 text-white font-medium  border border-transparent transition-all duration-300 hover:bg-[#f6121d] hover:border-white hover:scale-[1.03] active:scale-100'
                    >{state}</button>
                </form>

                {state === 'Sign up' ? (<p className='text-gray-400 text-center text-xs mt-4'>
                    Already have an account?{' '}
                    <span onClick={() => setState('Login')} className='text-blue-400 cursor-pointer underline' >Login here</span>
                </p>) :
                    (<p className='text-gray-400 text-center text-xs mt-4'>
                        Don't have an account?{' '}
                        <span onClick={() => setState('Sign up')} className='text-blue-400 cursor-pointer underline' >Sign up</span>
                    </p>)}

            </div>
        </div>
    )
};

export default Login;