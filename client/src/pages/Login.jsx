import React, { useState } from "react";
import { FaUser, FaLock, FaHeart } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";
import api from "../api/client";
import toast from "react-hot-toast";
import Button from "../components/common/Button";
import { InlineSpinner } from "../components/common/Spinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser, navigate } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // use instance baseURL; send to /user/login
      const res = await api.post("/user/login", { email, password });
      const data = res.data;
      if (data && data.success) {
        setUser(data.data);
        toast.success(data.message || "Logged in");
        navigate("/dashboard");
      } else {
        setUser(null);
        toast.error((data && data.message) || "Invalid credentials");
      }
    } catch (error) {
      setUser(null);
      // axios network / server errors often put message on error.message
      const msg =
        error?.response?.data?.message || error.message || "Network Error";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-[#52d4cb]">
            <FaHeart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Medical Record System
          </h1>
          <p className="text-gray-600">Eastern University Healthcare Center</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Sign In
            </h2>
            <p className="text-gray-600 text-sm">
              Enter your credentials to access the medical records system
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="email">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#52d4cb] focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#52d4cb] focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Sign In Button */}
            <div>
              <Button
                type="submit"
                variant="primary"
                size="large"
                className="w-full"
                loading={loading}>
                Sign In
              </Button>
            </div>
          </form>

          {/* Forgot Password */}
          <div className="mt-4 text-center">
            <a
              href="#"
              className="text-sm text-[#399491] hover:text-[#52d4cb] transition-colors duration-200">
              Forgot password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
