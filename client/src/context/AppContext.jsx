import { useContext } from "react";
import { createContext } from "react";
import { axios } from "axios";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const values = {
    api,
    navigate,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
