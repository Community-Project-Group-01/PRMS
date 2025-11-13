import React, { useState } from "react";
import api from "../../api/client";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { emailValidator, mobileNumberValidator } from "../../utils/validator";

const DoctorForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "doctor",
    specialization: "",
    licenseNumber: "",
    yearsOfExperience: "",
    contact: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!emailValidator(formData.email))
      newErrors.email = "Valid email is required.";
    if (!formData.specialization.trim())
      newErrors.specialization = "Specialization is required.";
    if (!formData.licenseNumber.trim())
      newErrors.licenseNumber = "License number is required.";
    if (!formData.yearsOfExperience)
      newErrors.yearsOfExperience = "Years of experience is required.";
    if (!mobileNumberValidator(formData.contact))
      newErrors.contact = "Valid 10-digit contact number required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/api/doctor/register", {
        ...formData,
        role: "doctor",
      });

      const backendMessage =
        res.data?.message || "Doctor registered successfully!";
      setMessage(backendMessage);
      toast.success(backendMessage);

      // Reset form
      setFormData({
        name: "",
        email: "",
        role: "doctor",
        specialization: "",
        licenseNumber: "",
        yearsOfExperience: "",
        contact: "",
      });
    } catch (error) {
      console.error(error);
      const backendError =
        error.response?.data?.message ||
        "Failed to register doctor. Please try again.";

      setMessage(backendError);
      toast.error(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-center text-primary-dark mb-6">
          Doctor Registration Form
        </h2>

        {message && (
          <div
            className={`text-center mb-4 font-medium ${
              message.includes("successfully") ? "text-primary" : "text-red-500"
            }`}>
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block mb-1 text-primary-dark">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-primary rounded-lg p-2 focus:outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-primary-dark">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-primary rounded-lg p-2 focus:outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Specialization */}
          <div>
            <label className="block mb-1 text-primary-dark">
              Specialization
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full border border-primary rounded-lg p-2 focus:outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
            />
            {errors.specialization && (
              <p className="text-red-500 text-sm">{errors.specialization}</p>
            )}
          </div>

          {/* License Number */}
          <div>
            <label className="block mb-1 text-primary-dark">
              License Number
            </label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full border border-primary rounded-lg p-2 focus:outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
            />
            {errors.licenseNumber && (
              <p className="text-red-500 text-sm">{errors.licenseNumber}</p>
            )}
          </div>

          {/* Years of Experience */}
          <div>
            <label className="block mb-1 text-primary-dark">
              Years of Experience
            </label>
            <input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              min="0"
              className="w-full border border-primary rounded-lg p-2 focus:outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
            />
            {errors.yearsOfExperience && (
              <p className="text-red-500 text-sm">{errors.yearsOfExperience}</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <label className="block mb-1 text-primary-dark">
              Contact Number
            </label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="E.g. 0712345678"
              className="w-full border border-primary rounded-lg p-2 focus:outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
            />
            {errors.contact && (
              <p className="text-red-500 text-sm">{errors.contact}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-between items-center mt-6">
            <Button
              type="button"
              onClick={() => navigate(-1)}
              size="medium"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-6 py-2 rounded-lg transition duration-200">
              Back
            </Button>

            <Button
              type="submit"
              disabled={loading}
              size="medium"
              className={`text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-200 ${
                loading
                  ? "bg-secondary-dark opacity-70"
                  : "bg-primary hover:bg-primary-dark"
              }`}>
              {loading ? "Registering..." : "Register Doctor"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorForm;
