import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUserMd,
  FaUsers,
  FaCalendarAlt,
  FaChevronRight,
  FaFileMedical,
  FaUser,
} from "react-icons/fa";

const sidebarItems = {
  admin: [
    { name: "Overview", icon: <FaHome />, path: "overview" },
    { name: "Doctors", icon: <FaUserMd />, path: "doctors" },
    { name: "Patients", icon: <FaUsers />, path: "patients" },
    { name: "Inventory", icon: <FaFileMedical />, path: "inventory" },
    { name: "Profile", icon: <FaUser />, path: "profile" },
  ],
  doctor: [
    { name: "Overview", icon: <FaHome />, path: "overview" },
    { name: "Patients", icon: <FaUsers />, path: "patients" },
    { name: "Appointments", icon: <FaCalendarAlt />, path: "appointments" },
    { name: "Profile", icon: <FaUser />, path: "profile" },
  ],
};

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const items = sidebarItems[role] || [];

  const getActiveSection = () => {
    const pathSegments = location.pathname.split("/");
    return pathSegments[pathSegments.length - 1];
  };

  const handleClick = (item) => {
    navigate(`/dashboard/${role}/${item.path}`);
    localStorage.setItem("activeComponent", item.path);
  };

  const activeSection = getActiveSection();

  return (
    <aside
      className="p-4 w-20 lg:w-64 bg-primary-dark rounded-2xl shadow-xl 
                 h-4/5 sticky top-6 transition-all duration-300 flex flex-col items-center lg:items-start">
      {/* Sidebar Header */}
      <div className="mb-8 hidden lg:block">
        <h2 className="text-white text-xl font-bold capitalize">
          {role} Dashboard
        </h2>
      </div>

      {/* Sidebar Menu */}
      <ul className="space-y-3 w-full">
        {items.map((item) => {
          const isActive = activeSection === item.path;

          return (
            <li key={item.name} className="relative group">
              <button
                onClick={() => handleClick(item)}
                className={`w-full flex items-center justify-center lg:justify-between 
                            gap-3 py-3 px-4 rounded-xl cursor-pointer transition-all duration-300 
                            relative overflow-hidden
                            ${
                              isActive
                                ? "bg-white text-primary-dark shadow-lg scale-[1.02]"
                                : "text-white hover:bg-white/10 hover:shadow-md"
                            }`}>
                <div className="flex items-center gap-3 z-10 justify-center lg:justify-start">
                  <span
                    className={`text-lg transition-transform duration-300 ${
                      isActive
                        ? "text-primary-dark scale-110"
                        : "group-hover:scale-110"
                    }`}>
                    {item.icon}
                  </span>

                  {/* Text only visible on large screens */}
                  <span
                    className={`font-semibold capitalize transition-all duration-300 hidden lg:block ${
                      isActive ? "text-primary-dark" : "group-hover:text-white"
                    }`}>
                    {item.name}
                  </span>
                </div>

                {/* Chevron only for large screens */}
                <span
                  className={`hidden lg:block z-10 transition-all duration-300 ${
                    isActive
                      ? "text-primary-dark opacity-100 translate-x-0"
                      : "text-white/0 group-hover:text-white/70 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1"
                  }`}>
                  <FaChevronRight size={12} />
                </span>

                {/* Hover underline effect */}
                <div
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent transition-all duration-300 ${
                    isActive ? "opacity-50" : "opacity-0 group-hover:opacity-30"
                  }`}
                />
              </button>

              {/* Tooltip for smaller screens */}
              <span
                className="absolute left-20 top-1/2 -translate-y-1/2 
                           bg-black text-white text-xs font-medium 
                           py-1 px-2 rounded opacity-0 group-hover:opacity-100 
                           pointer-events-none hidden md:block lg:hidden">
                {item.name}
              </span>
            </li>
          );
        })}
      </ul>

      {/* User Profile */}
      <div className="mt-8 pt-6 border-t border-white/20 w-full hidden lg:block">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {role?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-semibold capitalize">
              {role}
            </p>
            <p className="text-white/60 text-xs">Online</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
