import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f3f4f6' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#52d4cb' }}>
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Record System</h1>
          <p className="text-gray-600">Eastern University Healthcare Center</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600 text-sm">Enter your credentials to access the medical records system</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ focusRing: '2px solid #52d4cb' }}
                  onFocus={(e) => e.target.style.borderColor = '#52d4cb'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                  onFocus={(e) => e.target.style.borderColor = '#52d4cb'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full text-white font-medium py-3 rounded-md transition-colors duration-200"
              style={{ backgroundColor: '#52d4cb' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#399491'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#52d4cb'}
            >
              Sign In
            </button>
          </form>

          {/* Forgot Password & Register */}
          <div className="mt-4 text-center space-y-2">
            <a
              href="#"
              className="text-sm transition-colors duration-200 block"
              style={{ color: '#399491' }}
              onMouseEnter={(e) => e.target.style.color = '#52d4cb'}
              onMouseLeave={(e) => e.target.style.color = '#399491'}
            >
              Forgot password?
            </a>

            <a
              href="#"
              className="text-sm font-medium transition-colors duration-200 block"
              style={{ color: '#399491' }}
              onMouseEnter={(e) => e.target.style.color = '#52d4cb'}
              onMouseLeave={(e) => e.target.style.color = '#399491'}
            >
              Don't have an account? Register now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}