import React, { createContext, useEffect, useState } from "react";
import axios from "axios";


export const AppContent = createContext(null);

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");
      if (data.success) {
        setUserData(data.userData);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setIsLoggedin(false);
        setUserData(null);
      }
    }
  };

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth");
      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      }
    } catch {
      // silent fail
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  axios.defaults.baseURL = backendUrl;
  axios.defaults.withCredentials = true;

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};


