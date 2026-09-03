import React, { useState } from "react";
import api from "../../api/client";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { emailValidator, mobileNumberValidator } from "../../utils/validator";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiAward,
  FiBriefcase,
  FiHash,
  FiArrowLeft,
  FiUserPlus,
  FiAlertCircle,
  FiInfo,
} from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";

const SPECIALIZATION_SUGGESTIONS = [
  "General Medicine",
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Neurology",
  "Orthopedics",
  "ENT (Ear, Nose, Throat)",
  "Ophthalmology",
  "Psychiatry",
  "Gynecology & Obstetrics",
  "General Surgery",
  "Dental Surgery",
  "Radiology",
  "Anesthesiology",
  "Pathology",
];

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

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailValidator(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.specialization.trim()) {
      newErrors.specialization = "Specialization is required.";
    }
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = "Medical license number is required.";
    }
    if (
      formData.yearsOfExperience === "" ||
      isNaN(Number(formData.yearsOfExperience)) ||
      Number(formData.yearsOfExperience) < 0
    ) {
      newErrors.yearsOfExperience = "Please enter valid years of experience (0 or more).";
    }
    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required.";
    } else if (!mobileNumberValidator(formData.contact)) {
      newErrors.contact = "Valid 10-digit mobile number required (e.g. 0712345678).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/api/doctor/register", {
        ...formData,
        yearsOfExperience: Number(formData.yearsOfExperience),
        role: "doctor",
      });

      const backendMessage =
        res.data?.message || "Doctor registered successfully!";
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
      setErrors({});

      // Navigate back to doctors list
      setTimeout(() => {
        navigate("/dashboard/admin/doctors");
      }, 800);
    } catch (error) {
      console.error(error);
      const backendError =
        error.response?.data?.message ||
        "Failed to register doctor. Please try again.";
      toast.error(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-primary to-secondary px-8 py-7 text-white relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xs flex items-center justify-center shadow-xs">
                  <FaUserDoctor className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">Doctor Registration</h2>
                    <span className="bg-white/25 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Admin Portal
                    </span>
                  </div>
                  <p className="text-sm text-white/90 mt-1">
                    Add and onboard medical practitioners to the PRMS network
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="self-start sm:self-center flex items-center gap-1.5 text-xs font-medium text-white/90 bg-white/15 hover:bg-white/25 px-3.5 py-2 rounded-xl backdrop-blur-xs transition duration-200">
                <FiArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            {/* Section 1: Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-gray-800">
                    Personal & Account Information
                  </h3>
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  <span className="text-red-500 font-bold">*</span> Mandatory fields
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Doctor Full Name <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <FiUser className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="E.g. Dr. Kasun Perera"
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-white focus:bg-white border rounded-xl text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 cursor-pointer ${
                        errors.name
                          ? "border-red-400 focus:ring-red-400/30 focus:border-red-500 bg-red-50/20"
                          : "border-gray-200 focus:ring-primary/20 focus:border-primary hover:border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <FiMail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="doctor@hospital.lk"
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-white focus:bg-white border rounded-xl text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 ${
                        errors.email
                          ? "border-red-400 focus:ring-red-400/30 focus:border-red-500 bg-red-50/20"
                          : "border-gray-200 focus:ring-primary/20 focus:border-primary hover:border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Contact Number <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <FiPhone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      placeholder="0712345678"
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-white focus:bg-white border rounded-xl text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 ${
                        errors.contact
                          ? "border-red-400 focus:ring-red-400/30 focus:border-red-500 bg-red-50/20"
                          : "border-gray-200 focus:ring-primary/20 focus:border-primary hover:border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.contact ? (
                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.contact}
                    </p>
                  ) : (
                    <span className="text-[11px] text-gray-400 mt-1 block">
                      10-digit Sri Lankan phone number format
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Professional Credentials */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    <FiAward className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-gray-800">
                    Professional Credentials & Practice
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Specialization */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Specialization <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <FiBriefcase className="w-4 h-4" />
                    </div>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-white focus:bg-white border rounded-xl text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 ${
                        errors.specialization
                          ? "border-red-400 focus:ring-red-400/30 focus:border-red-500 bg-red-50/20"
                          : "border-gray-200 focus:ring-primary/20 focus:border-primary hover:border-gray-300"
                      }`}
                    >
                      <option value="" disabled>
                        Select a specialization
                      </option>
                      {SPECIALIZATION_SUGGESTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.specialization && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.specialization}
                    </p>
                  )}
                </div>

                {/* License Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Medical License / SLMC Number <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <FiHash className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      placeholder="E.g. SLMC-28491"
                      className={`w-full pl-10 pr-4 py-2.5 font-mono bg-gray-50/50 hover:bg-white focus:bg-white border rounded-xl text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 ${
                        errors.licenseNumber
                          ? "border-red-400 focus:ring-red-400/30 focus:border-red-500 bg-red-50/20"
                          : "border-gray-200 focus:ring-primary/20 focus:border-primary hover:border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.licenseNumber && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.licenseNumber}
                    </p>
                  )}
                </div>

                {/* Years of Experience */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Years of Experience <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <FiAward className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      min="0"
                      max="70"
                      placeholder="E.g. 5"
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-white focus:bg-white border rounded-xl text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 ${
                        errors.yearsOfExperience
                          ? "border-red-400 focus:ring-red-400/30 focus:border-red-500 bg-red-50/20"
                          : "border-gray-200 focus:ring-primary/20 focus:border-primary hover:border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.yearsOfExperience && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.yearsOfExperience}
                    </p>
                  )}
                </div>

                {/* Information Card */}
                <div className="bg-primary/5 rounded-xl border border-primary/20 p-3.5 flex items-start gap-3">
                  <FiInfo className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Default login credentials with temporary access will be generated and associated with the registered email address. The doctor will be prompted to set a personal password upon first sign-in.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Actions Footer */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 pt-6 border-t border-gray-100">
              <Button
                type="button"
                onClick={() => navigate(-1)}
                size="medium"
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2.5 rounded-xl transition duration-200 flex items-center justify-center gap-2">
                <FiArrowLeft className="w-4 h-4" />
                Cancel
              </Button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  type="submit"
                  disabled={loading}
                  loading={loading}
                  size="medium"
                  className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                  <FiUserPlus className="w-4 h-4" />
                  Register Doctor
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorForm;
