import React from "react";
import {
  FaHeart,
  FaExclamationTriangle,
  FaHome,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-whitesmoke py-8">
      <div className="w-full max-w-2xl px-4">
        {/* Error Card */}
        <div className="bg-gray-50 rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="text-center mb-8">
            {/* Error Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
              <FaExclamationTriangle className="w-8 h-8 text-red-500" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h2>

            <div className="space-y-4">
              <p className="text-gray-600 text-lg">
                Sorry, we couldn't find the page you're looking for.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-gray-500">
                  The page may have been moved, deleted, or you may have entered
                  an incorrect URL.
                </p>
              </div>

              <p className="text-gray-500 text-sm">Error Code: 404</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200 hover:shadow-md w-full sm:w-auto">
              <FaArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
