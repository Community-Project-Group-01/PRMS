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
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className="w-20 lg:w-64 flex-shrink-0">
        <Sidebar role={role} />
      </div>

      {/*dashboard content */}
      <main className="flex-1 overflow-y-auto p-6">{renderDashboard()}</main>
    </div>
  );
};

export default Dashboard;
