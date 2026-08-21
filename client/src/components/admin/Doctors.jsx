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
  FiAward,
  FiBriefcase,
} from "react-icons/fi";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import api from "../../api/client";
import { useNavigate } from "react-router-dom";
import Pagination from "../common/Pagination";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 0, total: 0 });
  const navigate = useNavigate();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate years of experience
  const calculateExperience = (years) => {
    if (!years) return "0 years";
    return `${years} year${years !== 1 ? "s" : ""}`;
  };

  // Fetch all doctors
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      setError(null);

      const response = await api.get("/api/doctor/getdoctor", {
        params: { page, limit: 10 },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = response.data;
      const doctorsData = data.data || data.doctors || data || [];
      setDoctors(doctorsData);
      setFilteredDoctors(doctorsData);
      setPagination(data.meta || { page, pages: 0, total: doctorsData.length });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to fetch doctors";
      setError(errorMessage);
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch doctor by ID
  const fetchDoctorById = async (id) => {
    try {
      setFetchingDetails(true);
      const response = await api.get(`/api/doctor/getdoctor/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = response.data;
      setSelectedDoctor(data.data || data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch doctor details";
      console.error("Error fetching doctor:", err);
      alert(errorMessage);
    } finally {
      setFetchingDetails(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [page]);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(
        (doctor) =>
          doctor.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.licenseNumber
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          doctor.contact?.includes(searchTerm) ||
          doctor.user?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          doctor.specialization
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  }, [searchTerm, doctors]);

  const handleViewDetails = (doctor) => {
    fetchDoctorById(doctor._id);
  };

  const handleRefresh = () => {
    fetchDoctors();
  };

  const handleAddDoctor = () => {
    navigate("/dashboard/admin/add-doctor");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner
          size="large"
          variant="primary"
          showText
          text="Loading doctor records..."
        />
      </div>
    );
  }

  return (
    <div className={"min-h-screen bg-white p-6"}>
      <div className="max-w-auto mx-auto">
        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search doctors by name, license, email, specialization, or mobile number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-white"
                />
              </div>
            </div>

            {/* Action Buttons */}
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
              <Button
                variant="primary"
                size="medium"
                onClick={handleAddDoctor}
                className="min-w-[140px] flex items-center justify-center bg-primary hover:bg-primary-dark">
                <FiUserPlus className="w-4 h-4 mr-2" />
                Add Doctor
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
                <p className="font-semibold">Unable to load doctors</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {!error && doctors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Doctors
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {doctors.length}
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
                    {filteredDoctors.length}
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

        {/* Doctors Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Doctor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Specialization
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Mobile
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    License No
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDoctors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FiSearch className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-xl font-semibold text-gray-500 mb-2">
                          No doctors found
                        </p>
                        <p className="text-gray-400 max-w-md">
                          {searchTerm
                            ? `No results found for "${searchTerm}". Try adjusting your search terms.`
                            : "No doctor records available."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDoctors.map((doctor) => (
                    <tr
                      key={doctor._id}
                      className="hover:bg-primary/5 transition-colors cursor-pointer group"
                      onClick={() => handleViewDetails(doctor)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:shadow-md transition-shadow">
                            {doctor.user?.name?.charAt(0).toUpperCase() || "D"}
                          </div>
                          <div>
                            <span className="text-base font-semibold text-gray-800 group-hover:text-primary transition-colors block">
                              Dr. {doctor.user?.name || "Unnamed Doctor"}
                            </span>
                            {doctor.user?.email && (
                              <span className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <FiMail className="w-3 h-3" />
                                {doctor.user.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {doctor.specialization || "General"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FiPhone className="w-4 h-4 text-primary" />
                          {doctor.contact || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                          {doctor.licenseNumber || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {filteredDoctors.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-semibold text-gray-800">
                    {filteredDoctors.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-800">
                    {doctors.length}
                  </span>{" "}
                  doctors
                </p>
                <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border">
                  Click on any row to view details
                </span>
              </div>
            </div>
          )}
          <Pagination {...pagination} page={page} onPageChange={setPage} />
        </div>

        {/* Doctor Details Modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-2xl">
                      {selectedDoctor.user?.name?.charAt(0).toUpperCase() ||
                        "D"}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Doctor Details</h2>
                      <p className="text-white/90 text-sm">
                        Complete doctor information
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDoctor(null)}
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
                    {/* Professional Information */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center gap-2">
                        <FiAward className="text-primary" />
                        Professional Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">
                            Full Name
                          </p>
                          <p className="text-lg text-gray-800 font-semibold">
                            Dr. {selectedDoctor.user?.name || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">
                            Specialization
                          </p>
                          <p className="text-lg text-gray-800 font-semibold">
                            {selectedDoctor.specialization || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">
                            Years of Experience
                          </p>
                          <p className="text-lg text-gray-800 font-semibold">
                            {calculateExperience(
                              selectedDoctor.yearsOfExperience
                            )}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">
                            License Number
                          </p>
                          <p className="text-lg text-gray-800 font-semibold font-mono">
                            {selectedDoctor.licenseNumber || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">
                            Qualification
                          </p>
                          <p className="text-lg text-gray-800 font-semibold">
                            {selectedDoctor.qualification || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">
                            Department
                          </p>
                          <p className="text-lg text-gray-800 font-semibold capitalize">
                            {selectedDoctor.department || "N/A"}
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
                            {selectedDoctor.contact || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <FiMail className="w-4 h-4 text-primary" />
                            Email Address
                          </p>
                          <p className="text-lg text-gray-800 font-semibold">
                            {selectedDoctor.user?.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    {selectedDoctor.address && (
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
                            {selectedDoctor.address}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Availability */}
                    {selectedDoctor.availability && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center gap-2">
                          <FiCalendar className="text-primary" />
                          Availability
                        </h3>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">
                            Working Schedule
                          </p>
                          <p className="text-lg text-gray-800">
                            {selectedDoctor.availability}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                      <Button
                        variant="primary"
                        size="large"
                        className="bg-primary hover:bg-primary-dark min-w-[120px]"
                        onClick={() => setSelectedDoctor(null)}>
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

export default Doctors;

