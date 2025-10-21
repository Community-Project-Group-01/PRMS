import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import toast from "react-hot-toast";
import Button from "../common/Button";
import Spinner from "../common/Spinner";

const AddDoctor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    licenseNumber: "",
    yearsOfExperience: "",
    contact: "",
    role: "doctor",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await Axios.post(
        "http://localhost:5000/api/doctor/register",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Doctor registered successfully ✅");
      console.log("Doctor registered:", response.data);

      navigate("/dashboard/admin/doctors");
    } catch (error) {
      console.error("Error registering doctor:", error);
      toast.error(
        error.response?.data?.message || "Failed to register doctor ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow relative">
      {/* Close Button */}
      <div
        className="absolute top-4 right-4 text-xl font-medium text-primary-dark cursor-pointer"
        onClick={() => navigate("/dashboard/admin/doctors")}
      >
        X
      </div>

      <h2 className="text-xl font-bold mb-4 text-center">Register Doctor</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Doctor Name"
          className="w-full border border-gray-300 px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border border-gray-300 px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          placeholder="Specialization"
          className="w-full border border-gray-300 px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="licenseNumber"
          value={formData.licenseNumber}
          onChange={handleChange}
          placeholder="License Number"
          className="w-full border border-gray-300 px-3 py-2 rounded"
          required
        />
        <input
          type="number"
          name="yearsOfExperience"
          value={formData.yearsOfExperience}
          onChange={handleChange}
          placeholder="Years of Experience"
          min="0"
          className="w-full border border-gray-300 px-3 py-2 rounded"
        />
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          placeholder="Contact Number"
          className="w-full border border-gray-300 px-3 py-2 rounded"
        />
        {/* <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
          />
          <label>Available</label>
        </div> */}

        <div className="flex justify-end">
          <Button
            type="submit"
            className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 ${
              loading && "opacity-75 cursor-not-allowed"
            }`}
            disabled={loading}
          >
            {loading && <Spinner size={4} />} Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
