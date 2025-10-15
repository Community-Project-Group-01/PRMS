import React from "react";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoutes from "./middleware/ProtectedRoutes";
import ErrorPage from "./pages/ErrorPage";
import { useAppContext } from "./context/AppContext";

const App = () => {
  const { user } = useAppContext();

  return (
    <div className="bg-secondary/1">
      <div className="max-w-7xl mx-auto px-4">
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route
            path="/login"
            element={
              user ? (
                user.role === "admin" ? (
                  <Navigate to="/dashboard/admin" replace />
                ) : (
                  <Navigate to="/dashboard/doctor" replace />
                )
              ) : (
                <Login />
              )
            }
          />

          {/*  redirect to /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* PROTECTED ROUTES */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Route>

          {/* ERROR PAGE */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
