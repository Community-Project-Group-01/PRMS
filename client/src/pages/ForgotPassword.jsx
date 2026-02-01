import React, { useState } from "react";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import toast from "react-hot-toast";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/user/forgot-password", { email });
      const data = res.data;

      if (data && data.success) {
        setSubmitted(true);
        toast.success(data.message || "Password reset link sent to your email");
      } else {
        toast.error(data.message || "Failed to send reset link");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message || error.message || "Network Error";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-gray-50 min-h-screen w-full flex items-center justify-center py-8">
        <div className="w-full flex items-center justify-center flex-col px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Check Your Email
              </h2>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Please check your inbox and click on the link to reset your password. The link will expire in 1 hour.
              </p>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="large"
                  onClick={() => navigate("/login")}
                  className="w-full">
                  Back to Login
                </Button>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setEmail("");
                  }}
                  className="text-sm text-primary hover:text-primary-dark transition-colors">
                  Send to a different email
                </button>
              </div>
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

        {/* Forgot Password Card */}
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Forgot Password?
            </h2>
            <p className="text-gray-500 text-sm">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Enter your email"
                  required
                />
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
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
                <FaArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
