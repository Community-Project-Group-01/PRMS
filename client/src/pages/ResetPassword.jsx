import React, { useState, useEffect } from "react";
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/client";
import toast from "react-hot-toast";
import Button from "../components/common/Button";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link");
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/user/reset-password", {
        token,
        newPassword,
      });
      const data = res.data;

      if (data && data.success) {
        setSuccess(true);
        toast.success(data.message || "Password reset successfully");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message || error.message || "Network Error";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-gray-50 min-h-screen w-full flex items-center justify-center py-8">
        <div className="w-full flex items-center justify-center flex-col px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Password Reset Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Your password has been reset successfully. You can now login with your new password.
              </p>
              <Button
                variant="primary"
                size="large"
                onClick={() => navigate("/login")}
                className="w-full">
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen w-full flex items-center justify-center py-8">
      <div className="w-full flex items-center justify-center flex-col px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Medical Record System
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Eastern University Healthcare Center
          </p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Reset Password
            </h2>
            <p className="text-gray-500 text-sm">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div className="space-y-2">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="newPassword">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Enter new password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="large"
                className="w-full py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                loading={loading}
                disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-primary transition-colors">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
