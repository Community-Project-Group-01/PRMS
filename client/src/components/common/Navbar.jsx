// components/layout/Navbar.jsx
import React, { useEffect, useState } from "react";
import {
  FaUserInjured,
  FaHospital,
  FaSignOutAlt,
  FaBars,
  FaChartPie,
  FaFile,
  FaLaptopMedical,
  FaTimes,
} from "react-icons/fa";
import Button from "./Button";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import api from "../../api/client";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, navigate } = useAppContext();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: FaChartPie },
    { href: "/patients", label: "Patients", icon: FaUserInjured },
    { href: "/records", label: "Medical Records", icon: FaFile },
    { href: "/appointments", label: "Appointments", icon: FaLaptopMedical },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigateToLogin = () => {
    if (!user) {
      navigate("/login");
    }
  };

  useEffect(() => {
    navigateToLogin();
  }, []);

  return (
    <nav className="bg-white text-primary-dark sticky top-0 z-40">
      <div className="mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Brand & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="small"
              className="md:hidden border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-white"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu">
              {isMobileMenuOpen ? (
                <FaTimes className="w-4 h-4" />
              ) : (
                <FaBars className="w-4 h-4" />
              )}
            </Button>

            <div className="flex items-center space-x-3">
              <FaHospital className="w-8 h-8 text-primary-dark" />
              <div>
                <h1 className="text-xl font-bold leading-tight">
                  University Health
                </h1>
                <p className="text-xs text-secondary-dark">Patient Records</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-primary-dark hover:text-white transition-colors duration-200">
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* User Menu */}
          {user && (
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-3 bg-primary-dark/10 px-3 py-2 rounded-lg border border-primary-dark/20">
                <div className="w-8 h-8 bg-primary-dark rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user.role.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-primary-dark">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-primary-dark/70">Physician</p>
                </div>
              </div>

              <Button
                variant="primary"
                size="small"
                className="hover:bg-primary-dark cursor-pointer"
                aria-label="Sign out">
                <FaSignOutAlt className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-96 opacity-100 py-4"
              : "max-h-0 opacity-0 py-0"
          } overflow-hidden border-t border-gray-200`}>
          {user && (
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary-dark hover:text-white transition-colors duration-200 text-primary-dark font-medium">
                    {Icon && <Icon className="w-5 h-5" />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Mobile User Info */}
              <div className="flex items-center space-x-3 px-4 py-3 mt-4 border-t border-gray-200 pt-4">
                <div className="w-10 h-10 bg-primary-dark rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user.role.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-primary-dark">{user.name}</p>
                  <p className="text-sm text-primary-dark/70">Physician</p>
                </div>
              </div>
            </nav>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
