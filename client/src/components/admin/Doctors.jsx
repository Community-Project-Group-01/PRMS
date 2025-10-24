import React, { useEffect, useState } from "react";
import Axios from "axios";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import { useNavigate } from "react-router-dom";

const Doctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null); // for popup

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await Axios.get(
          "http://localhost:5000/api/doctor/getdoctor",
          { withCredentials: true }
        );
        setDoctors(response.data.data);
      } catch (err) {
        console.error("Request failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto relative">
          {!loading && doctors.length === 0 && (
            <p className="text-gray-500">No doctors found.</p>
          )}

          {/* Table */}
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border border-gray-300 px-4 py-2 text-center w-1/12">
                  No
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Doctor Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center w-3/12">
                  Specialization
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(doctors) &&
                doctors.map((doctor, index) => (
                  <tr
                    key={doctor._id}
                    className="hover:bg-gray-50 text-gray-700 text-sm"
                  >
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {doctor.user?.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {doctor.specialization}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <Button onClick={() => setSelectedDoctor(doctor)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Add Doctor Button */}
          <div className="mt-4 mb-2 mr-1 flex justify-end">
            <Button onClick={() => navigate("/dashboard/admin/add-doctor")}>
              Add Doctor
            </Button>
          </div>

          {/* Modal Popup */}
          {selectedDoctor && (
            <div className="fixed inset-0  bg-black/70 flex items-center justify-center z-50">
              <div className="bg-white w-96 rounded-lg shadow-lg p-6 relative">
                <button
                  className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
                  onClick={() => setSelectedDoctor(null)}
                >
                  ×
                </button>

                <h2 className="text-lg font-semibold mb-4 text-center">
                  Doctor Details
                </h2>

                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <strong>Name:</strong> {selectedDoctor.user?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedDoctor.user?.email}
                  </p>
                  <p>
                    <strong>Specialization:</strong>{" "}
                    {selectedDoctor.specialization}
                  </p>
                  <p>
                    <strong>License No:</strong> {selectedDoctor.licenseNumber}
                  </p>
                  <p>
                    <strong>Experience:</strong>{" "}
                    {selectedDoctor.yearsOfExperience} years
                  </p>
                  <p>
                    <strong>Contact:</strong> {selectedDoctor.contact}
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <div className="mt-4 flex justify-end gap-3">
                    <Button
                      onClick={() => setSelectedDoctor(null)}
                      className="bg-gray-400 hover:bg-gray-500 text-white"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Doctors;
