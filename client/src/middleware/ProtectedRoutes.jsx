import React from "react";
import { useAppContext } from "../context/AppContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { user } = useAppContext();
  console.log("user", user);

  if (!user) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default ProtectedRoutes;
