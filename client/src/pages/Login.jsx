import React, { useState } from "react";
import { FaUser, FaLock, FaHeart, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";
import api from "../api/client";
import toast from "react-hot-toast";
import Button from "../components/common/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setUser, navigate } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/user/login", { email, password });
      const data = res.data;
      const user = data.data;

      if (data && data.success) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success(data.message || "Logged in successfully");
        navigate(`/dashboard/${user.role}`);
      } else {
        setUser(null);
        localStorage.removeItem("user");
        toast.error((data && data.message) || "Invalid credentials");
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem("user");
      const msg =
        error?.response?.data?.message || error.message || "Network Error";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full flex items-center justify-center bg-whitesmoke py-8 pb-5">
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

        {/* Login Card */}
        <div className="bg-white w-4/12 h-8/12 rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm">
              Sign in to access your medical records dashboard
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
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#52d4cb] focus:border-[#52d4cb] transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#52d4cb] focus:border-[#52d4cb] transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#52d4cb] border-gray-300 rounded focus:ring-[#52d4cb]"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>

              <a
                href="#"
                className="text-sm font-medium text-[#399491] hover:text-[#52d4cb] transition-colors duration-200">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="large"
                className="w-full py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-[#52d4cb] to-[#399491] hover:from-[#399491] hover:to-[#52d4cb] transform hover:-translate-y-0.5"
                loading={loading}
                disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </div>
          </form>

          {/* Additional Help Text */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              For security reasons, please log out after each session
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
