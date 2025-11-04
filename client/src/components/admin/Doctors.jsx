// import React, { useEffect, useState } from "react";
// import Axios from "axios";
// import Button from "../common/Button";
// import Spinner from "../common/Spinner";
// import { useNavigate } from "react-router-dom";
// import api from "../../api/client";

// const Doctors = () => {
//   const navigate = useNavigate();
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDoctor, setSelectedDoctor] = useState(null); // for popup

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         setLoading(true);
//         const response = await Axios.get(
//           `localhost:5173/api/doctor/getdoctor`, 
//           { withCredentials: true }
//         );
//         setDoctors(response.data.data);
//       } catch (err) {
//         console.error("Request failed:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDoctors();
//   }, []);

//   return (
//     <div>
//       {loading ? (
//         <Spinner />
//       ) : (
        
//         <div className="overflow-x-auto relative">
//           {!loading && doctors.length === 0 && (
//             <p className="text-gray-500">No doctors found.</p>
//           )}

//           {/* Table */}
//           <table className="min-w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-100 text-left">
//                 <th className="border border-gray-300 px-4 py-2 text-center w-1/12">
//                   No
//                 </th>
//                 <th className="border border-gray-300 px-4 py-2 text-center">
//                   Doctor Name
//                 </th>
//                 <th className="border border-gray-300 px-4 py-2 text-center w-3/12">
//                   Specialization
//                 </th>
//                 <th className="border border-gray-300 px-4 py-2 text-center">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {Array.isArray(doctors) &&
//                 doctors.map((doctor, index) => (
//                   <tr
//                     key={doctor._id}
//                     className="hover:bg-gray-50 text-gray-700 text-sm"
//                   >
//                     <td className="border border-gray-300 px-4 py-2 text-center">
//                       {index + 1}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2 text-center">
//                       {doctor.user?.name}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2 text-center">
//                       {doctor.specialization}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2 text-center">
//                       <Button onClick={() => setSelectedDoctor(doctor)}>
//                         View
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>

//           {/* Add Doctor Button */}
//           <div className="mt-4 mb-2 mr-1 flex justify-end">
//             <Button onClick={() => navigate("/dashboard/admin/add-doctor")}>
//               Add Doctor
//             </Button>
//           </div>

//           {/* Modal Popup */}
//           {selectedDoctor && (
//             <div className="fixed inset-0  bg-black/70 flex items-center justify-center z-50">
//               <div className="bg-white w-96 rounded-lg shadow-lg p-6 relative">
//                 <button
//                   className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
//                   onClick={() => setSelectedDoctor(null)}
//                 >
//                   ×
//                 </button>

//                 <h2 className="text-lg font-semibold mb-4 text-center">
//                   Doctor Details
//                 </h2>

//                 <div className="space-y-2 text-sm text-gray-700">
//                   <p>
//                     <strong>Name:</strong> {selectedDoctor.user?.name}
//                   </p>
//                   <p>
//                     <strong>Email:</strong> {selectedDoctor.user?.email}
//                   </p>
//                   <p>
//                     <strong>Specialization:</strong>{" "}
//                     {selectedDoctor.specialization}
//                   </p>
//                   <p>
//                     <strong>License No:</strong> {selectedDoctor.licenseNumber}
//                   </p>
//                   <p>
//                     <strong>Experience:</strong>{" "}
//                     {selectedDoctor.yearsOfExperience} years
//                   </p>
//                   <p>
//                     <strong>Contact:</strong> {selectedDoctor.contact}
//                   </p>
//                 </div>

//                 <div className="mt-4 flex justify-end">
//                   <div className="mt-4 flex justify-end gap-3">
//                     <Button
//                       onClick={() => setSelectedDoctor(null)}
//                       className="bg-gray-400 hover:bg-gray-500 text-white"
//                     >
//                       Close
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Doctors;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Button from "../common/Button";
import Spinner from "../common/Spinner";// Adjust import path as needed

const Doctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await Axios.get(
          `http://localhost:5173/api/doctor/getdoctor`, 
          { withCredentials: true }
        );
        // Ensure we set an array even if the response structure is different
        setDoctors(response.data?.data || []);
      } catch (err) {
        console.error("Request failed:", err);
        setDoctors([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Filter doctors based on search term - with null checks
  const filteredDoctors = (doctors || []).filter(doctor => {
    if (!doctor) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      doctor.user?.name?.toLowerCase().includes(searchLower) ||
      doctor.user?.email?.toLowerCase().includes(searchLower) ||
      doctor.contact?.includes(searchTerm) ||
      doctor.licenseNumber?.toLowerCase().includes(searchLower) ||
      doctor.specialization?.toLowerCase().includes(searchLower)
    );
  });

  const totalDoctors = doctors?.length || 0;
  const filteredCount = filteredDoctors.length;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="mb-6">
        
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search doctors by name, email, contact, license, or specialization..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={() => window.location.reload()} // Simple refresh
            >
              Refresh
            </button>
            <button 
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              onClick={() => navigate("/dashboard/admin/add-doctor")}
            >
              Add Doctor
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-100 p-4 rounded-lg ">
            <div className="text-2xl font-bold text-text-black">{totalDoctors}</div>
            <div className="text-sm text-gray-700">Total Doctors</div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg ">
            <div className="text-2xl font-bold text-black">{filteredCount}</div>
            <div className="text-sm text-gray-700">Filtered Results</div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg ">
            <div className="text-sm text-gray-600">Active Search</div>
            <div className="text-lg font-semibold text-gray-700">
              {searchTerm ? `"${searchTerm}"` : "No active search"}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner />
        </div>
      ) : (
        <div>
          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    License No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCount === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      {totalDoctors === 0 ? "No doctors found." : "No doctors found matching your search."}
                    </td>
                  </tr>
                ) : (
                  filteredDoctors.map((doctor, index) => (
                    <tr 
                      key={doctor._id || index} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedDoctor(doctor)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {doctor.user?.name || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {doctor.user?.email || "No email"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{doctor.specialization || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{doctor.contact || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{doctor.licenseNumber || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDoctor(doctor);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredCount} of {totalDoctors} doctors
          </div>

          <div className="mt-2 text-xs text-gray-500">
            Click on any row to view details
          </div>
        </div>
      )}

      {/* Modal Popup */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
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

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Name:</span>
                <span>{selectedDoctor.user?.name || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Email:</span>
                <span>{selectedDoctor.user?.email || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Specialization:</span>
                <span>{selectedDoctor.specialization || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">License No:</span>
                <span>{selectedDoctor.licenseNumber || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Experience:</span>
                <span>{selectedDoctor.yearsOfExperience || "0"} years</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Contact:</span>
                <span>{selectedDoctor.contact || "N/A"}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setSelectedDoctor(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;