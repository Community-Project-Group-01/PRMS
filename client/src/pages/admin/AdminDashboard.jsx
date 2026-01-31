import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Overview from "../../components/admin/Overview";
import Patients from "../../components/admin/Patients";
import Doctors from "../../components/admin/Doctors";
import Inventory from "../../components/admin/Inventory";

const AdminDashboard = ({ section }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to default section if no section is specified
    const pathSegments = location.pathname.split("/");
    const currentSection = pathSegments[pathSegments.length - 1];

    if (currentSection === "admin") {
      const defaultSection =
        localStorage.getItem("activeComponent") || "overview";
      navigate(`/dashboard/admin/${defaultSection}`, { replace: true });
    }
  }, [location.pathname, navigate]);

  const renderComponent = () => {
    switch (section) {
      case "overview":
        return <Overview />;
      case "patients":
        return <Patients />;
      case "doctors":
        return <Doctors />;
      case "inventory":
        return <Inventory />;
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

export default AdminDashboard;
