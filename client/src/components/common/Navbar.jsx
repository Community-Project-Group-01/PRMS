// components/layout/Navbar.jsx
import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaHospital,
  FaSignOutAlt,
  FaBars,
  FaChartPie,
  FaTimes,
} from "react-icons/fa";
import Button from "./Button";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const Navbar = () => {
  const { userDetails, user, logout } = useAppContext();
  const location = useLocation();
  const myPath = location.pathname.split("/")[1];

  const handleLogout = async () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-sm text-primary-dark sticky top-0 z-40 p-3">
      <div className="mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Brand & Mobile Menu */}
          <div className="flex items-center space-x-4">

            <div className="flex items-center space-x-3">
              <FaHospital className="w-8 h-8 text-primary-dark" />
              <div>
                <h1 className="text-xl font-bold leading-tight">
                  PRMS
                </h1>
                <p className="text-xs text-secondary-dark">Patient Records Management System</p>
              </div>
            </div>
          </div>

          {/* User Menu */}
          {user && (
            // desktop navigation
            <div className="flex gap-6">
             
              <div className="flex items-center space-x-3">
                <div className="hidden md:flex items-center space-x-3 bg-primary-dark/10 px-3 py-2 rounded-lg border border-primary-dark/20">
                  <div className="w-8 h-8 bg-primary-dark rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {user.role.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-primary-dark">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-primary-dark/70">
                      {userDetails?.userDetails?.specialization}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleLogout}
                  variant="primary"
                  size="small"
                  className="hover:bg-primary-dark cursor-pointer"
                  aria-label="Sign out">
                  <FaSignOutAlt className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
