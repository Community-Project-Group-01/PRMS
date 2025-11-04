/*import React from "react";

const Patients = () => {
  return <div>Patients</div>;
};

export default Patients;*/

import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiUserPlus,
  FiX,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
} from "react-icons/fi";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import api from "../../api/client";
import { useNavigate } from "react-router-dom";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const navigate = useNavigate();

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      setError(null);

      const response = await api.get("/api/patient/getPatient", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = response.data;

      const patientsData = data.data || data.patients || data || [];
      setPatients(patientsData);
      setFilteredPatients(patientsData);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch patients";
      setError(errorMessage);
      console.error("Error fetching patients:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch patient by ID
  const fetchPatientById = async (id) => {
    try {
      setFetchingDetails(true);
      const response = await api.get(`/api/patient/getPatient/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = response.data;

      setSelectedPatient(data.data || data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch patient details";
      console.error("Error fetching patient:", err);
      alert(errorMessage);
    } finally {
      setFetchingDetails(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.user?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          patient.nic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.contact?.includes(searchTerm) ||
          patient.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);

  const handleViewDetails = (patient) => {
    fetchPatientById(patient._id);
  };

  const handleRefresh = () => {
    fetchPatients();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner
          size="large"
          variant="primary"
          showText
          text="Loading patient records..."
        />
      </div>
    );
  }

  return (
    <div className={"min-h-screen bg-white p-6"}>
      <div className="max-w-7xl mx-auto">
        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search patients by name, NIC, email, or mobile number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-white"
                />
              </div>
            </div>

            {/* Action Buttons - Fixed Alignment */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Button
                variant="outline"
                size="medium"
                onClick={handleRefresh}
                loading={refreshing}
                className="min-w-[120px] flex items-center justify-center border-primary text-primary hover:bg-primary hover:text-white">
                {!refreshing && <FiRefreshCw className="w-4 h-4 mr-2" />}
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
              <div>
                <p className="font-semibold">Unable to load patients</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {!error && patients.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Patients
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {patients.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <FiUserPlus className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Filtered Results
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {filteredPatients.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <FiSearch className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Search
                  </p>
                  <p className="text-lg font-semibold text-gray-800 mt-2 truncate">
                    {searchTerm || "No active search"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary-dark/10 rounded-full flex items-center justify-center">
                  <FiRefreshCw className="w-6 h-6 text-secondary-dark" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Patient Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Age
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Gender
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Mobile
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    NIC
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FiSearch className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-xl font-semibold text-gray-500 mb-2">
                          No patients found
                        </p>
                        <p className="text-gray-400 max-w-md">
                          {searchTerm
                            ? `No results found for "${searchTerm}". Try adjusting your search terms.`
                            : "No patient records available."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr
                      key={patient._id}
                      className="hover:bg-primary/5 transition-colors cursor-pointer group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:shadow-md transition-shadow">
                            {patient.user?.name?.charAt(0).toUpperCase() || "P"}
                          </div>
                          <div>
                            <span className="text-base font-semibold text-gray-800 group-hover:text-primary transition-colors block">
                              {patient.user?.name || "Unnamed Patient"}
                            </span>
                            {patient.user?.email && (
                              <span className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <FiMail className="w-3 h-3" />
                                {patient.user.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary-dark">
                          {calculateAge(patient.dob)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            patient.gender === "Male"
                              ? "bg-blue-100 text-blue-800"
                              : patient.gender === "Female"
                              ? "bg-pink-100 text-pink-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                          {patient.gender || "N/A"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FiPhone className="w-4 h-4 text-primary" />
                          {patient.contact || "N/A"}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                          {patient.nic || "N/A"}
                        </span>
                      </td>

                      {/* ✅ Action button cell */}
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="primary"
                          size="small"
                          onClick={() =>
                            navigate(`/appointment/${patient._id}`)
                          }>
                          Consult
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {filteredPatients.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-semibold text-gray-800">
                    {filteredPatients.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-800">
                    {patients.length}
                  </span>{" "}
                  patients
                </p>
                <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border">
                  Click on any row to view details
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Patient Details Modal */}
        {selectedPatient && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-2xl">
                      {selectedPatient.user?.name?.charAt(0).toUpperCase() ||
                        "P"}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Patient Details</h2>
                      <p className="text-white/90 text-sm">
                        Complete patient information
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="text-white hover:text-white/80 text-2xl p-2 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center w-10 h-10">
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                {fetchingDetails ? (
                  <div className="flex justify-center py-12">
                    <Spinner size="large" variant="primary" />
                  </div>
                ) : (
                  <>
                    {/* Personal Information */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center gap-2">
                        <FiCalendar className="text-primary" />
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">
                            Full Name
                          </p>
                          <p className="text-lg text-gray-800 font-semibold">
                            {selectedPatient.user?.name || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">
                            Age
                          </p>
                          <p className="text-lg text-gray-800 font-semibold">
                            {calculateAge(selectedPatient.dob)}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">
                            Date of Birth
                          </p>
                          <p className="text-lg text-gray-800 font-semibold">
                            {formatDate(selectedPatient.dob)}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">
                            Gender
                          </p>
                          <p className="text-lg text-gray-800 font-semibold">
                            {selectedPatient.gender || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">
                            NIC
                          </p>
                          <p className="text-lg text-gray-800 font-semibold font-mono">
                            {selectedPatient.nic || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">
                            Patient Type
                          </p>
                          <p className="text-lg text-gray-800 font-semibold capitalize">
                            {selectedPatient.patientType || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center gap-2">
                        <FiPhone className="text-primary" />
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <FiPhone className="w-4 h-4 text-primary" />
                            Mobile Number
                          </p>
                          <p className="text-lg text-gray-800 font-semibold">
                            {selectedPatient.contact || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <FiMail className="w-4 h-4 text-primary" />
                            Email Address
                          </p>
                          <p className="text-lg text-gray-800 font-semibold">
                            {selectedPatient.user?.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    {selectedPatient.address && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center gap-2">
                          <FiMapPin className="text-primary" />
                          Address
                        </h3>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">
                            Residential Address
                          </p>
                          <p className="text-lg text-gray-800">
                            {selectedPatient.address}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Allergies */}
                    {selectedPatient.allergies &&
                      selectedPatient.allergies.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                            Allergies
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {selectedPatient.allergies.map((allergy, index) => (
                              <span
                                key={index}
                                className="px-4 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-full border border-red-200">
                                {allergy}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                      <Button
                        variant="primary"
                        size="large"
                        className="bg-primary hover:bg-primary-dark min-w-[120px]"
                        onClick={() => setSelectedPatient(null)}>
                        Close
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
