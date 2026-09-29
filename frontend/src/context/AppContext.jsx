import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);

  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const [userData, setUserData] = useState(null);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendURL + "/api/doctor/list");

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendURL + "/api/user/get-profile", {
        headers: { token },
      });

      if (!data.success || !data.userData) {
        setUserData(null);
        return;
      }

      const user = data.userData;

      setUserData({
        ...user,
        address:
          user.address && typeof user.address === "string"
            ? JSON.parse(user.address)
            : user.address || { line1: "", line2: "" },
      });
    } catch (error) {
      console.log(error);
      setUserData(false);
    }
  };

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendURL,
    userData,
    setUserData,
    loadUserProfileData,
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(null);
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
