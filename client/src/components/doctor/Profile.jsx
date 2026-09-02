import React, { useState } from "react";
import {
  FiEdit2,
  FiSave,
  FiX,
  FiMail,
  FiUser,
  FiLock,
  FiPhone,
  FiAward,
  FiBriefcase,
  FiHash,
  FiArrowLeft,
  FiAlertCircle,
  FiKey,
  FiShield,
} from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import { useAppContext } from "../../context/AppContext";
import { emailValidator, mobileNumberValidator } from "../../utils/validator";
import toast from "react-hot-toast";

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

const Profile = () => {
  const { userDetails, api, refreshUser, loading } = useAppContext();
  const doctorDetails = userDetails?.userDetails;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    licenseNumber: "",
    yearsOfExperience: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const startEditing = () => {
    setFormData({
      name: userDetails?.name || "",
      email: userDetails?.email || "",
      specialization: doctorDetails?.specialization || "",
      licenseNumber: doctorDetails?.licenseNumber || "",
      yearsOfExperience: doctorDetails?.yearsOfExperience ?? "",
      contact: doctorDetails?.contact || "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required.";
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
      newErrors.yearsOfExperience = "Please enter valid years of experience.";
    }
    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required.";
    } else if (!mobileNumberValidator(formData.contact)) {
      newErrors.contact = "Valid 10-digit mobile number required (e.g. 0712345678).";
    }

    if (formData.password || formData.confirmPassword) {
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long.";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the highlighted errors.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        specialization: formData.specialization,
        licenseNumber: formData.licenseNumber,
        yearsOfExperience: Number(formData.yearsOfExperience),
        contact: formData.contact,
      };
      if (formData.password) payload.password = formData.password;

      const res = await api.post("/api/doctor/update", payload);
      toast.success(res.data?.message || "Profile updated successfully!");
      await refreshUser();
      setEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="large" variant="primary" showText text="Loading doctor profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-7 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold backdrop-blur-xs shadow-xs">
                  {userDetails?.name?.charAt(0).toUpperCase() || "D"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{userDetails?.name || "Doctor Profile"}</h2>
                    <span className="bg-white/25 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {userDetails?.role || "Doctor"}
                    </span>
                  </div>
                  <p className="text-sm text-white/90 mt-1 flex items-center gap-2">
                    <span>{doctorDetails?.specialization || "Medical Practitioner"}</span>
                    {doctorDetails?.licenseNumber && (
                      <span className="bg-white/15 px-2 py-0.5 rounded-md text-xs font-mono">
                        {doctorDetails.licenseNumber}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {!editing ? (
                <Button
                  variant="outline"
                  size="medium"
                  onClick={startEditing}
                  className="self-start sm:self-center flex items-center gap-2 bg-white text-primary hover:bg-white/90 border-transparent shadow-xs font-semibold px-5 py-2 rounded-xl transition duration-200">
                  <FiEdit2 className="w-4 h-4" />
                  Edit Profile
                </Button>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="self-start sm:self-center flex items-center gap-1.5 text-xs font-medium text-white/90 bg-white/15 hover:bg-white/25 px-3.5 py-2 rounded-xl backdrop-blur-xs transition duration-200">
                  <FiArrowLeft className="w-4 h-4" />
                  Cancel Editing
                </button>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {!editing ? (
              <div className="space-y-6">
                {/* Personal Information Cards */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      <FiUser className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-gray-800">
                      Personal & Contact Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <FiUser className="text-primary w-3.5 h-3.5" /> Full Name
                      </p>
                      <p className="text-base text-gray-800 font-bold">
                        Dr. {userDetails?.name || "N/A"}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <FiMail className="text-primary w-3.5 h-3.5" /> Email Address
                      </p>
                      <p className="text-base text-gray-800 font-bold truncate">
                        {userDetails?.email || "N/A"}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <FiPhone className="text-primary w-3.5 h-3.5" /> Mobile Number
                      </p>
                      <p className="text-base text-gray-800 font-bold">
                        {doctorDetails?.contact || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Professional Practice Cards */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      <FiAward className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-gray-800">
                      Professional Credentials & Practice
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <FiBriefcase className="text-primary w-3.5 h-3.5" /> Specialization
                      </p>
                      <p className="text-base text-gray-800 font-bold">
                        {doctorDetails?.specialization || "General Medicine"}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <FiHash className="text-primary w-3.5 h-3.5" /> License Number
                      </p>
                      <p className="text-base text-gray-800 font-bold font-mono">
                        {doctorDetails?.licenseNumber || "N/A"}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <FiAward className="text-primary w-3.5 h-3.5" /> Clinical Experience
                      </p>
                      <p className="text-base text-gray-800 font-bold">
                        {doctorDetails?.yearsOfExperience !== undefined
                          ? `${doctorDetails.yearsOfExperience} Years`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        <FiUser className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-bold text-gray-800">
                        Personal & Contact Details
                      </h3>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                      <span className="text-red-500 font-bold">*</span> Mandatory fields
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
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
                          placeholder="Dr. Kasun Perera"
                          className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-white focus:bg-white border rounded-xl text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 ${
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

                    <div className="col-span-1 md:col-span-2">
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
                      {errors.contact && (
                        <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                          <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          {errors.contact}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        <FiAward className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-bold text-gray-800">
                        Professional Practice & Credentials
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Specialization <span className="text-red-500 font-bold">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <FiBriefcase className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          name="specialization"
                          list="profile-specialization-list"
                          value={formData.specialization}
                          onChange={handleChange}
                          placeholder="E.g. Cardiology"
                          className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-white focus:bg-white border rounded-xl text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 ${
                            errors.specialization
                              ? "border-red-400 focus:ring-red-400/30 focus:border-red-500 bg-red-50/20"
                              : "border-gray-200 focus:ring-primary/20 focus:border-primary hover:border-gray-300"
                          }`}
                        />
                        <datalist id="profile-specialization-list">
                          {SPECIALIZATION_SUGGESTIONS.map((item) => (
                            <option key={item} value={item} />
                          ))}
                        </datalist>
                      </div>
                      {errors.specialization && (
                        <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                          <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          {errors.specialization}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Medical License Number <span className="text-red-500 font-bold">*</span>
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
                          placeholder="SLMC-12345"
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
                          min="0"
                          max="70"
                          value={formData.yearsOfExperience}
                          onChange={handleChange}
                          placeholder="Years in Practice"
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
                  </div>
                </div>

                {/* Password Change */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        <FiKey className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-bold text-gray-800">
                        Security & Password
                      </h3>
                    </div>
                    <span className="text-xs text-gray-400">
                      Leave blank to keep existing password
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <FiLock className="w-4 h-4" />
                        </div>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-white focus:bg-white border rounded-xl text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 ${
                            errors.password
                              ? "border-red-400 focus:ring-red-400/30 focus:border-red-500 bg-red-50/20"
                              : "border-gray-200 focus:ring-primary/20 focus:border-primary hover:border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                          <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <FiLock className="w-4 h-4" />
                        </div>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-white focus:bg-white border rounded-xl text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 ${
                            errors.confirmPassword
                              ? "border-red-400 focus:ring-red-400/30 focus:border-red-500 bg-red-50/20"
                              : "border-gray-200 focus:ring-primary/20 focus:border-primary hover:border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                          <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Actions Footer */}
                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 pt-6 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="medium"
                    className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2.5 rounded-xl transition duration-200 flex items-center justify-center gap-2 border-transparent"
                    onClick={() => setEditing(false)}
                    disabled={saving}>
                    <FiX className="w-4 h-4" />
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    size="medium"
                    className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                    loading={saving}>
                    <FiSave className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

