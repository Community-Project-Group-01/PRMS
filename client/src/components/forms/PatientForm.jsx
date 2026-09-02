import React, { useState, useEffect } from "react";
import api from "../../api/client";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  emailValidator,
  mobileNumberValidator,
  validateSriLankanNIC,
} from "../../utils/validator";
import { calculateAge } from "../../utils/calculateAge";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiHash,
  FiTag,
  FiActivity,
  FiArrowLeft,
  FiUserPlus,
  FiAlertCircle,
  FiPlus,
  FiX,
  FiCheck,
  FiClock,
} from "react-icons/fi";
import { FaHospitalUser } from "react-icons/fa6";

const COMMON_ALLERGIES = [
  "Penicillin",
  "Aspirin",
  "Sulfa Drugs",
  "Paracetamol",
  "Ibuprofen",
  "Amoxicillin",
  "Latex",
  "Peanuts",
];

const PatientForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "patient",
    nic: "",
    gender: "",
    patientType: "",
    allergies: [],
    contact: "",
    address: "",
    dob: "",
    age: "",
  });

  const [allergyInput, setAllergyInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Automatically calculate age when dob changes
  useEffect(() => {
    if (formData.dob) {
      const derivedAge = calculateAge(formData.dob);
      setFormData((prev) => ({
        ...prev,
        age: derivedAge !== null && derivedAge !== undefined ? derivedAge : "",
      }));
      if (errors.age || errors.dob) {
        setErrors((prev) => ({ ...prev, age: "", dob: "" }));
      }
    }
  }, [formData.dob]);

  // Allergy handling
  const handleAllergyInputChange = (e) => setAllergyInput(e.target.value);

  const addAllergy = (allergyToAdd) => {
    const value = (typeof allergyToAdd === "string" ? allergyToAdd : allergyInput).trim();
    if (!value) return;

    // Check duplicate
    if (
      formData.allergies.some(
        (a) => a.toLowerCase() === value.toLowerCase()
      )
    ) {
      toast("Allergy already added to list", { icon: "ℹ️" });
      setAllergyInput("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      allergies: [...prev.allergies, value],
    }));
    setAllergyInput("");
  };

  const removeAllergy = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleAllergyKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addAllergy();
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (formData.email.trim() && !emailValidator(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.nic.trim()) {
      newErrors.nic = "National Identity Card (NIC) is required.";
    } else if (!validateSriLankanNIC(formData.nic.trim())) {
      newErrors.nic = "Invalid Sri Lankan NIC format (e.g. 991234567V or 200012345678).";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select gender.";
    }

    if (!formData.patientType) {
      newErrors.patientType = "Please select patient category.";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required.";
    } else if (!mobileNumberValidator(formData.contact)) {
      newErrors.contact = "Valid 10-digit mobile number required (e.g. 0712345678).";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required.";
    }

    if (formData.age === "" || isNaN(Number(formData.age)) || Number(formData.age) < 0) {
      newErrors.age = "Valid age is required.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Residential address is required.";
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
      const res = await api.post("/api/patient/register", {
        ...formData,
        role: "patient",
        email: formData.email.trim() || "undefined",
        age: Number(formData.age),
      });

      const backendMessage =
        res.data?.message || "Patient registered successfully!";
      toast.success(backendMessage);

      // Reset form
      setFormData({
        name: "",
        email: "",
        role: "patient",
        nic: "",
        gender: "",
        patientType: "",
        allergies: [],
        contact: "",
        address: "",
        dob: "",
        age: "",
      });
      setAllergyInput("");
      setErrors({});

      // Navigate back to patients list
      setTimeout(() => {
        navigate("/dashboard/admin/patients");
      }, 800);
    } catch (error) {
      console.error(error);
      const backendError =
        error.response?.data?.message ||
        "Failed to register patient. Please try again.";
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
                  <FaHospitalUser className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">Patient Registration</h2>
                    <span className="bg-white/25 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Clinical Portal
                    </span>
                  </div>
                  <p className="text-sm text-white/90 mt-1">
                    Register a patient profile and initialize electronic health record
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
            {/* Section 1: Basic & Identification Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-gray-800">
                    Basic & Identification Details
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
                    Patient Full Name <span className="text-red-500 font-bold">*</span>
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
                      placeholder="E.g. Saman Kumara Silva"
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

                {/* NIC */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    National Identity Card (NIC) <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <FiHash className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="nic"
                      value={formData.nic}
                      onChange={handleChange}
                      placeholder="991234567V or 200012345678"
                      className={`w-full pl-10 pr-4 py-2.5 font-mono bg-gray-50/50 hover:bg-white focus:bg-white border rounded-xl text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 ${
                        errors.nic
                          ? "border-red-400 focus:ring-red-400/30 focus:border-red-500 bg-red-50/20"
                          : "border-gray-200 focus:ring-primary/20 focus:border-primary hover:border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.nic ? (
                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.nic}
                    </p>
                  ) : (
                    <span className="text-[11px] text-gray-400 mt-1 block">
                      Sri Lankan 9-digit (V/X) or new 12-digit format
                    </span>
                  )}
                </div>

                {/* Email (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-gray-700">
                      Email Address
                    </label>
                    <span className="text-[11px] text-gray-400 font-normal">
                      Optional
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <FiMail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="patient@gmail.com"
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

                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Gender <span className="text-red-500 font-bold">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-gray-50/50 hover:bg-white focus:bg-white border rounded-xl text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 cursor-pointer ${
                      errors.gender
                        ? "border-red-400 focus:ring-red-400/30 focus:border-red-500 bg-red-50/20"
                        : "border-gray-200 focus:ring-primary/20 focus:border-primary hover:border-gray-300"
                    }`}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.gender}
                    </p>
                  )}
                </div>

                {/* Patient Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Patient Category <span className="text-red-500 font-bold">*</span>
                  </label>
                  <select
                    name="patientType"
                    value={formData.patientType}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-gray-50/50 hover:bg-white focus:bg-white border rounded-xl text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 cursor-pointer ${
                      errors.patientType
                        ? "border-red-400 focus:ring-red-400/30 focus:border-red-500 bg-red-50/20"
                        : "border-gray-200 focus:ring-primary/20 focus:border-primary hover:border-gray-300"
                    }`}>
                    <option value="">Select Category</option>
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="public">Public</option>
                  </select>
                  {errors.patientType && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.patientType}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Demographics, Contact & Address */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    <FiCalendar className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-gray-800">
                    Demographics & Contact Information
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Date of Birth <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <FiCalendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      max={new Date().toISOString().split("T")[0]}
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-white focus:bg-white border rounded-xl text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 ${
                        errors.dob
                          ? "border-red-400 focus:ring-red-400/30 focus:border-red-500 bg-red-50/20"
                          : "border-gray-200 focus:ring-primary/20 focus:border-primary hover:border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.dob && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.dob}
                    </p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-gray-700">
                      Age <span className="text-red-500 font-bold">*</span>
                    </label>
                    {formData.dob && formData.age !== "" && (
                      <span className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <FiClock className="w-3 h-3" /> Auto-calculated from DOB
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <FiUser className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Age in years"
                      min="0"
                      max="130"
                      disabled={!!formData.dob}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 ${
                        formData.dob
                          ? "bg-gray-100 text-gray-700 border-gray-200 cursor-not-allowed"
                          : "bg-gray-50/50 hover:bg-white focus:bg-white border-gray-200 focus:ring-primary/20 focus:border-primary"
                      } ${
                        errors.age
                          ? "border-red-400 focus:ring-red-400/30 focus:border-red-500 bg-red-50/20"
                          : ""
                      }`}
                    />
                  </div>
                  {errors.age && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.age}
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

                {/* Residential Address */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Residential Address <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3.5 pointer-events-none text-gray-400">
                      <FiMapPin className="w-4 h-4" />
                    </div>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="2.5"
                      placeholder="House No, Street, City / Postal Area"
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-white focus:bg-white border rounded-xl text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 resize-none ${
                        errors.address
                          ? "border-red-400 focus:ring-red-400/30 focus:border-red-500 bg-red-50/20"
                          : "border-gray-200 focus:ring-primary/20 focus:border-primary hover:border-gray-300"
                      }`}></textarea>
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <FiAlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Clinical & Allergy Profile */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 font-semibold text-sm">
                    <FiActivity className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-gray-800">
                    Allergies & Medical Alerts
                  </h3>
                </div>
                {formData.allergies.length > 0 && (
                  <span className="text-xs font-medium bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full">
                    {formData.allergies.length} {formData.allergies.length === 1 ? "allergy" : "allergies"} recorded
                  </span>
                )}
              </div>

              <div className="bg-gray-50/60 rounded-xl p-4 border border-gray-200/80 space-y-3">
                {/* Allergy Input Field */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Add Known Allergies (Food / Medication / Environmental)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <FiTag className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={allergyInput}
                        onChange={handleAllergyInputChange}
                        onKeyDown={handleAllergyKeyPress}
                        placeholder="Type allergy name (e.g. Penicillin, Peanuts) & press Enter"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => addAllergy()}
                      size="medium"
                      className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl transition duration-200 flex items-center gap-1.5 shadow-xs">
                      <FiPlus className="w-4 h-4" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Common Quick Suggestions */}
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Quick suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_ALLERGIES.map((allergy) => {
                      const isAdded = formData.allergies.some(
                        (a) => a.toLowerCase() === allergy.toLowerCase()
                      );
                      return (
                        <button
                          key={allergy}
                          type="button"
                          onClick={() => {
                            if (!isAdded) addAllergy(allergy);
                          }}
                          disabled={isAdded}
                          className={`text-xs px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                            isAdded
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-white border border-gray-300 text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/5"
                          }`}>
                          {isAdded ? <FiCheck className="w-3 h-3" /> : <FiPlus className="w-3 h-3 text-gray-400" />}
                          {allergy}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Allergy Tags List */}
                <div className="pt-2 border-t border-gray-200/60">
                  <span className="text-xs font-semibold text-gray-700 block mb-2">
                    Active Allergy Tags:
                  </span>

                  {formData.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.allergies.map((allergy, index) => (
                        <div
                          key={index}
                          className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-2xs group hover:bg-red-100 transition-colors">
                          <span className="font-semibold">{allergy}</span>
                          <button
                            type="button"
                            onClick={() => removeAllergy(index)}
                            aria-label={`Remove allergy ${allergy}`}
                            className="text-red-400 hover:text-red-700 hover:bg-red-200/60 rounded-full p-0.5 transition-colors focus:outline-none">
                            <FiX className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">
                      No allergies recorded for this patient. Type above or click quick suggestions if applicable.
                    </p>
                  )}
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
                  Register Patient
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
