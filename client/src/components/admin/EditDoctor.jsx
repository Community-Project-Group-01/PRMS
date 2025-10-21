import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import Spinner from "../common/Spinner";
import Button from "../common/Button";
import { toast } from "react-hot-toast";

const EditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await Axios.get(
          `http://localhost:5000/api/doctor/getDoctor/${id}`,
          { withCredentials: true }
        );
        setDoctor(response.data.data);
      } catch (error) {
        console.error("Error fetching doctor:", error);
        toast.error("Failed to fetch doctor details ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await Axios.post(
        `http://localhost:5000/api/doctor/update`,
        {
          email: doctor.user.email,
          contact: doctor.contact,
        },
        { withCredentials: true }
      );
      toast.success("Doctor updated successfully ✅");
      navigate("/dashboard/admin/doctors");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update doctor ❌");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Edit Doctor</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={doctor.user?.name || ""}
          disabled
          className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-100"
        />
        <input
          type="text"
          value={doctor.specialization || ""}
          disabled
          className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-100"
        />
        <input
          type="text"
          value={doctor.licenseNumber || ""}
          disabled
          className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-100"
        />
        <input
          type="number"
          value={doctor.yearsOfExperience || ""}
          disabled
          className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-100"
        />

        {/* Editable fields */}
        <input
          type="text"
          name="email"
          value={doctor.user?.email || ""}
          onChange={(e) =>
            setDoctor({
              ...doctor,
              user: { ...doctor.user, email: e.target.value },
            })
          }
          placeholder="Email"
          className="w-full border border-gray-300 px-3 py-2 rounded"
        />

        <input
          type="text"
          name="contact"
          value={doctor.contact || ""}
          onChange={handleChange}
          placeholder="Contact Number"
          className="w-full border border-gray-300 px-3 py-2 rounded"
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={() => navigate("/dashboard/admin/doctors")}
            className="bg-gray-400 hover:bg-gray-500 text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updating}
            className={`bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 ${
              updating && "opacity-75 cursor-not-allowed"
            }`}
          >
            {updating && <Spinner size={4} />} Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditDoctor;
