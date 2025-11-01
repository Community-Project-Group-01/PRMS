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
import Dashboard from "./pages/Dashboard";
import DoctorForm from "./components/forms/DoctorForm";
import MedicalRecordForm from "./components/medical/MedicalRecordForm";

const App = () => {
  const { user } = useAppContext();

  return (
    <div className="bg-secondary/1">
      <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to={`/dashboard/${user?.role}`} replace />
              ) : (
                <Login />
              )
            }
          />

          {/*  redirect to /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* PROTECTED ROUTES */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard/:role" element={<Dashboard />}>
              <Route path="/dashboard/:role/:section" element={<Dashboard />} />
            </Route>
            <Route
              path="/dashboard/:role/add-doctor"
              element={<DoctorForm />}
            />
            <Route
              path="/appointment/:patientId"
              element={<MedicalRecordForm />}
            />
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
