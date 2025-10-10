import React, {useState} from "react";
import axios from "axios";

const DoctorForm = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Doctor",
    specialization: "",
    licenseNumber: "",
    yearsOfExperience: "",
    contact: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/doctors/register",
        formData
      );
      setMessage({ text: response.data.message, type: "success" });
      setFormData({
        name: "",
        email: "",
        role: "Doctor",
        specialization: "",
        licenseNumber: "",
        yearsOfExperience: "",
        contact: "",
      });
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Error registering doctor";
      setMessage({ text: errMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[var(--color-white)]">
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--color-white)] rounded-2xl p-8 w-full max-w-lg"
        style={{
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-primary-dark)]">
          Register New Doctor
        </h2>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-primary-dark font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2" style={{ borderColor: "var(--color-primary)" }}
            />
          </div>

          <div>
            <label className="text-primary-dark font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2" style={{ borderColor: "var(--color-primary)" }}
            />
          </div>

          <div>
            <label className="text-primary-dark font-medium">Role</label>
            <input
              type="text"
              name="role"
              value="doctor"
              readOnly
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2" style={{ borderColor: "var(--color-primary)" }}
              required
            />
          </div>

          <div>
            <label className="text-primary-dark font-medium">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2" style={{ borderColor: "var(--color-primary)" }}
              required
            />
          </div>

          <div>
            <label className="text-primary-dark font-medium">License Number</label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2" style={{ borderColor: "var(--color-primary)" }}
              required
            />
          </div>

          <div>
            <label className="text-primary-dark font-medium">Years of Experience</label>
            <input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              min="0"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2" style={{ borderColor: "var(--color-primary)" }}
              required
            />
          </div>

          <div>
            <label className="text-primary-dark font-medium">Contact Number</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2" style={{ borderColor: "var(--color-primary)" }}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold py-2 rounded-lg transition-colors duration-300"
        >
          {loading ? "Registering..." : "Register Doctor"}
        </button>

        {/* Message Display */}
        {message.text && (
          <p
            className={`mt-4 text-center font-medium ${
              message.type === "success"
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
};
  

export default DoctorForm;
