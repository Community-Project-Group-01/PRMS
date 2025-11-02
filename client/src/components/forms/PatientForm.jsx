import React, { useState } from "react";
import api from "../../api/client";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  emailValidator,
  mobileNumberValidator,
  validateSriLankanNIC,
} from "../../utils/validator";

const PatientForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "patient",
    nic: "",
    gender: "",
    patientType: "",
    allergies: "",
    contact: "",
    address: "",
    dob: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validate form before submit
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!emailValidator(formData.email))
      newErrors.email = "Valid email is required.";
    if (!mobileNumberValidator(formData.contact))
      newErrors.contact = "Valid 10-digit contact number required.";
    if (!validateSriLankanNIC(formData.nic)) newErrors.nic = "NIC is required.";
    if (!formData.gender) newErrors.gender = "Please select gender.";
    if (!formData.patientType)
      newErrors.patientType = "Please select patient type.";
    if (!formData.dob) newErrors.dob = "Date of birth is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";

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
        allergies: "",
        contact: "",
        address: "",
        dob: "",
      });
    } catch (error) {
      console.error(error);

      // ✅ Try to extract message from backend response
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
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-center text-primary-dark mb-6">
          Patient Registration Form
        </h2>

        {message && (
          <div
            className={`text-center mb-4 font-medium ${
              message.includes("successfully") ? "text-primary" : "text-red-500"
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Full Name */}
          <div>
            <label className="block mb-1 text-primary-dark">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-primary rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
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
              className="w-full border border-primary rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block mb-1 text-primary-dark">Role</label>
            <input
              type="text"
              name="role"
              value="patient"
              readOnly
              className="w-full border border-primary rounded-lg p-2 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* NIC */}
          <div>
            <label className="block mb-1 text-primary-dark">NIC</label>
            <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              className="w-full border border-primary rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
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
              className="w-full border border-primary rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
            >
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
              className="w-full border border-primary rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
            >
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
            <input
              type="text"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="E.g. Penicillin, Peanuts"
              className="w-full border border-primary rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
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
              className="w-full border border-primary rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
            {errors.contact && (
              <p className="text-red-500 text-sm">{errors.contact}</p>
            )}
          </div>

          {/* DOB */}
          <div>
            <label className="block mb-1 text-primary-dark">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full border border-primary rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
            {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block mb-1 text-primary-dark">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full border border-primary rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
            ></textarea>
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
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-6 py-2 rounded-lg transition duration-200"
            >
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
              }`}
            >
              {loading ? "Registering..." : "Register Patient"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
