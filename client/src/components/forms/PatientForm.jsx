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
import { FaXmark } from "react-icons/fa6";

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
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Unified input style for consistent color behavior
  const inputClass =
    "w-full border border-primary rounded-lg p-2 transition duration-150 focus:outline-none focus:ring-1 focus:ring-primary-dark focus:border-primary-dark";

  // Automatically calculate age when dob changes
  useEffect(() => {
    if (formData.dob) {
      const derivedAge = calculateAge(formData.dob);
      setFormData((prev) => ({
        ...prev,
        age: derivedAge ?? "",
      }));
    }
  }, [formData.dob]);

  // Handle allergy input changes
  const handleAllergyInputChange = (e) => setAllergyInput(e.target.value);

  const addAllergy = () => {
    const allergy = allergyInput.trim();
    if (allergy && !formData.allergies.includes(allergy)) {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, allergy],
      }));
      setAllergyInput("");
    }
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

    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!validateSriLankanNIC(formData.nic))
      newErrors.nic = "Valid NIC is required.";
    if (!formData.gender) newErrors.gender = "Please select gender.";
    if (!formData.patientType)
      newErrors.patientType = "Please select patient type.";
    if (!mobileNumberValidator(formData.contact))
      newErrors.contact = "Valid 10-digit contact number required.";
    if (!formData.dob) newErrors.dob = "Date of birth is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.age) newErrors.age = "Age is required.";

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
      const res = await api.post("/api/patient/register", {
        ...formData,
        role: "patient",
        email: formData.email || "undefined",
      });

      const backendMessage =
        res.data?.message || "Patient registered successfully!";
      setMessage(backendMessage);
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
    } catch (error) {
      console.error(error);
      const backendError =
        error.response?.data?.message ||
        "Failed to register patient. Please try again.";
      setMessage(backendError);
      toast.error(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-semibold text-center text-primary-dark mb-6">
          Patient Registration Form
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
              className={inputClass}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-primary-dark">
              Email (Optional)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* NIC */}
          <div>
            <label className="block mb-1 text-primary-dark">NIC</label>
            <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.nic && <p className="text-red-500 text-sm">{errors.nic}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-1 text-primary-dark">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={inputClass}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender}</p>
            )}
          </div>

          {/* Patient Type */}
          <div>
            <label className="block mb-1 text-primary-dark">Patient Type</label>
            <select
              name="patientType"
              value={formData.patientType}
              onChange={handleChange}
              className={inputClass}>
              <option value="">Select Type</option>
              <option value="student">Student</option>
              <option value="public">Public</option>
              <option value="staff">Staff</option>
            </select>
            {errors.patientType && (
              <p className="text-red-500 text-sm">{errors.patientType}</p>
            )}
          </div>

          {/* Allergies */}
          <div className="md:col-span-2">
            <label className="block mb-1 text-primary-dark">Allergies</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={allergyInput}
                onChange={handleAllergyInputChange}
                onKeyPress={handleAllergyKeyPress}
                placeholder="E.g. Penicillin, Peanuts"
                className={`flex-1 ${inputClass}`}
              />
              <Button
                type="button"
                onClick={addAllergy}
                size="medium"
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition duration-200">
                Add
              </Button>
            </div>

            {formData.allergies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.allergies.map((allergy, index) => (
                  <div
                    key={index}
                    className="bg-secondary-dark text-primary-dark px-3 py-1 rounded-full flex items-center gap-2">
                    <span>{allergy}</span>
                    <button
                      type="button"
                      onClick={() => removeAllergy(index)}
                      className="text-primary-dark hover:text-red-500 focus:outline-none">
                      <FaXmark />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Number */}
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
              className={inputClass}
            />
            {errors.contact && (
              <p className="text-red-500 text-sm">{errors.contact}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block mb-1 text-primary-dark">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
          </div>

          {/* Age */}
          <div>
            <label className="block mb-1 text-primary-dark">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter Age"
              disabled={!!formData.dob}
              className={`${inputClass} ${
                formData.dob ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block mb-1 text-primary-dark">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className={inputClass}></textarea>
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
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
              {loading ? "Registering..." : "Register Patient"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
