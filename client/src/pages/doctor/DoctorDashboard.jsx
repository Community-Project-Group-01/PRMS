import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Overview from "../../components/doctor/Overview";
import Appointments from "../../components/doctor/Appointments";
import Patients from "../../components/doctor/Patients";
import Profile from "../../components/doctor/Profile";

const DoctorDashboard = ({ section }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to default section if no section is specified
    const pathSegments = location.pathname.split("/");
    const currentSection = pathSegments[pathSegments.length - 1];

    if (currentSection === "doctor") {
      const defaultSection =
        localStorage.getItem("activeComponent") || "overview";
      navigate(`/dashboard/doctor/${defaultSection}`, { replace: true });
    }
  }, [location.pathname, navigate]);

  const renderComponent = () => {
    switch (section) {
      case "overview":
        return <Overview />;
      case "appointments":
        return <Appointments />;
      case "patients":
        return <Patients />;
      case "profile":
        return <Profile />;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Section Not Found
              </h3>
              <p className="text-gray-500">
                The requested section "{section}" is not available.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-fit bg-gray-50/30">
      <div className="bg-white rounded-2xl shadow-sm">
        {renderComponent()}
      </div>
    </div>
  );
};

export default DoctorDashboard;
