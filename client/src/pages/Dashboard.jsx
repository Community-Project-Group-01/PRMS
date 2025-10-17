import React from "react";
import AdminDashboard from "./admin/AdminDashboard";
import DoctorDashboard from "./doctor/DoctorDashboard";
import Sidebar from "../components/common/Sidebar";
import { useParams } from "react-router-dom";

const Dashboard = () => {
  const { role, section } = useParams();

  const renderDashboard = () => {
    switch (role) {
      case "admin":
        return <AdminDashboard section={section} />;
      case "doctor":
        return <DoctorDashboard section={section} />;
      default:
        return (
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
              <div className="text-6xl mb-4">🚫</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Role Not Supported
              </h2>
              <p className="text-gray-600">
                No dashboard available for role: {role}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex gap-6 my-6 mx-auto">
      <Sidebar role={role} />
      <main className="flex-1 min-w-0">{renderDashboard()}</main>
    </div>
  );
};

export default Dashboard;
