import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const data = await api.get("/api/user/auth-me");

      if (data.data.success) {
        setUser(data.data.data);
      }
    } catch (error) {
      setUser(null);
      console.log("error in fetching User", error.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const values = {
    api,
    navigate,
    user,
    setUser,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
