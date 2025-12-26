import React, { useContext, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EmailVerify = () => {
  const { backendUrl, isLoggedin, userData, getUserData } =
    useContext(AppContent);

  const navigate = useNavigate();
  const inputRefs = useRef([]);

  /* ---------------- INPUT HANDLERS ---------------- */

  // Move forward after entering a digit
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Move backward on backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Paste OTP (all digits at once)
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    paste.split("").forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });

    inputRefs.current[Math.min(paste.length, 5)]?.focus();
  };

  /* ---------------- SUBMIT HANDLER ---------------- */

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      const otp = inputRefs.current.map((el) => el.value).join("");

      if (otp.length !== 6) {
        toast.error("Please enter a valid 6-digit OTP");
        return;
      }

      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        { otp }
      );

      if (data.success) {
        toast.success(data.message || "Email verified successfully");
        await getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  /* ---------------- AUTO REDIRECT ---------------- */

  useEffect(() => {
    if (isLoggedin && userData?.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedin, userData, navigate]);

  /* ---------------- UI ---------------- */

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background */}
      <img
        src={assets.netflix_bg_image}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        src={assets.logo_net}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {/* OTP Form */}
      <form
        className="bg-slate-900 p-8 rounded-lg w-[90%] max-w-sm"
        onSubmit={onSubmitHandler}
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verification
        </h1>

        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit OTP sent to your email.
        </p>

        <div
          className="flex justify-between mb-8"
          onPaste={handlePaste}
        >
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                required
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md outline-none"
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-full bg-linear-to-r from-red-500 to-red-900 text-white font-medium transition-all duration-300 hover:scale-105"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
