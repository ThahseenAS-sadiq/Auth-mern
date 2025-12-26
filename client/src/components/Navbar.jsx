import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();

  // ✅ FIX: include setters
  const {
    userData,
    backendUrl,
    setIsLoggedin,
    setUserData,
  } = useContext(AppContent);

  /* ---------------- SEND VERIFY OTP ---------------- */

  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/email-verify");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send verification OTP"
      );
    }
  };

  /* ---------------- LOGOUT ---------------- */

  const logout = () => {
    // ✅ JWT logout is CLIENT SIDE
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];

    setIsLoggedin(false);
    setUserData(null);

    toast.success("Logged out successfully");
    navigate("/");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img
        src={assets.logo_net}
        alt="Logo"
        className="w-28 sm:w-32"
      />

      {userData ? (
        <div className="flex justify-center items-center w-8 h-8 rounded-full bg-red-600 text-white relative group">
          {userData.name[0].toUpperCase()}

          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">

              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                >
                  Verify email
                </li>
              )}

              <li
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
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
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Navbar;

