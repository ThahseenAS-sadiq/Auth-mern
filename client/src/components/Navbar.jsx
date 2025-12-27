import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();

  const {
    userData,
    backendUrl,
    setIsLoggedin,
    setUserData,
  } = useContext(AppContent);

  /* ---------------- SEND VERIFY OTP ---------------- */

  const sendVerificationOtp = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const response = await axios.post(
        backendUrl + "/api/auth/send-verify-otp",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "OTP sent");
        navigate("/email-verify");
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {

      // ✅ NETWORK CHANGE HANDLING
      if (
        error.message?.includes("ERR_NETWORK_CHANGED") ||
        error.code === "ERR_NETWORK"
      ) {
        toast.error("Network changed. Please check your internet and try again.");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to send verification OTP"
        );
      }
    }
  };


  /* ---------------- LOGOUT ---------------- */

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];

    setIsLoggedin(false);
    setUserData(null);

    toast.success("Logged out successfully");
    navigate("/");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 z-50">
      {/* Logo */}
      <img
        src={assets.logo_net}
        alt="Logo"
        className="w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {userData ? (
        <div className="flex justify-center items-center w-9 h-9 rounded-full bg-red-600 text-white relative group cursor-pointer">
          {userData.name?.[0]?.toUpperCase()}

          {/* Dropdown */}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm rounded shadow-md">

              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1 px-3 hover:bg-gray-200 text-sm cursor-pointer rounded"
                >
                  Verify email
                </li>
              )}

              <li
                onClick={logout}
                className="py-1 px-3 hover:bg-gray-200 text-sm cursor-pointer rounded"
              >
                Logout
              </li>

            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 px-8 py-2.5 rounded bg-[#e50914] text-white font-medium transition-all duration-300 hover:scale-[1.03]"
        >
          Login
          <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
