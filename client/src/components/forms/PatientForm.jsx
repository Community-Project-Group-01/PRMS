import React, { useState } from "react";
import axios from "axios";

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://localhost:5000/api/patients/register", {
        ...formData,
        role: "patient",
      });
      setMessage("✅ Patient registered successfully!");
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
      setMessage("❌ Failed to register patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "var(--color-white)" }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl shadow-lg p-8"
        style={{
          backgroundColor: "var(--color-white)",
          boxShadow:
            "0 6px 20px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <h2
          className="text-3xl font-semibold text-center mb-6"
          style={{ color: "var(--color-primary-dark)" }}
        >
          Patient Registration Form
        </h2>

        {message && (
          <div
            className="text-center mb-4 font-medium"
            style={{
              color: message.includes("successfully")
                ? "var(--color-primary)"
                : "red",
            }}
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
            <label
              className="block mb-1"
              style={{ color: "var(--color-primary-dark)" }}
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--color-primary)" }}
            />
          </div>

          {/* Email */}
          <div>
            <label
              className="block mb-1"
              style={{ color: "var(--color-primary-dark)" }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--color-primary)" }}
            />
          </div>

          {/* Role */}
          <div>
            <label
              className="block mb-1"
              style={{ color: "var(--color-primary-dark)" }}
            >
              Role
            </label>
            <input
              type="text"
              name="role"
              value="patient"
              readOnly
              className="w-full border rounded-lg p-2 bg-gray-100 text-gray-600 cursor-not-allowed"
              style={{ borderColor: "var(--color-primary)" }}
            />
          </div>

          {/* NIC */}
          <div>
            <label
              className="block mb-1"
              style={{ color: "var(--color-primary-dark)" }}
            >
              NIC
            </label>
            <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--color-primary)" }}
            />
          </div>

          {/* Gender */}
          <div>
            <label
              className="block mb-1"
              style={{ color: "var(--color-primary-dark)" }}
            >
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--color-primary)" }}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Patient Type */}
          <div>
            <label
              className="block mb-1"
              style={{ color: "var(--color-primary-dark)" }}
            >
              Patient Type
            </label>
            <select
              name="patientType"
              value={formData.patientType}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--color-primary)" }}
            >
              <option value="">Select Type</option>
              <option value="student">Student</option>
              <option value="public">Public</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          {/* Allergies */}
          <div className="md:col-span-2">
            <label
              className="block mb-1"
              style={{ color: "var(--color-primary-dark)" }}
            >
              Allergies
            </label>
            <input
              type="text"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="E.g. Penicillin, Peanuts"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--color-primary)" }}
            />
          </div>

          {/* Contact */}
          <div>
            <label
              className="block mb-1"
              style={{ color: "var(--color-primary-dark)" }}
            >
              Contact Number
            </label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              placeholder="E.g. 0712345678"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--color-primary)" }}
            />
          </div>

          {/* DOB */}
          <div>
            <label
              className="block mb-1"
              style={{ color: "var(--color-primary-dark)" }}
            >
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--color-primary)" }}
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label
              className="block mb-1"
              style={{ color: "var(--color-primary-dark)" }}
            >
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--color-primary)" }}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-200"
              style={{
                backgroundColor: loading
                  ? "var(--color-secondary-dark)"
                  : "var(--color-primary)",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Registering..." : "Register Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
