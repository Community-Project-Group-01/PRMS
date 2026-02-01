import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiUser,
  FiFileText,
  FiActivity,
  FiHeart,
  FiThermometer,
  FiDroplet,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { FaPills } from "react-icons/fa";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import api from "../../api/client";

const PatientMedicalHistory = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("records"); // 'records' or 'prescriptions'
  
  // Pagination states
  const [recordsPage, setRecordsPage] = useState(1);
  const [prescriptionsPage, setPrescriptionsPage] = useState(1);
  const [recordsMeta, setRecordsMeta] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [prescriptionsMeta, setPrescriptionsMeta] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fetch patient details
  const fetchPatient = async () => {
    try {
      const response = await api.get(`/api/patient/getPatient/${patientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPatient(response.data.data || response.data);
    } catch (err) {
      console.error("Error fetching patient:", err);
    }
  };

  // Fetch medical records with pagination
  const fetchMedicalRecords = async (page = 1) => {
    try {
      const response = await api.get(`/api/med/patient/${patientId}`, {
        params: { page, limit: 10 },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      setMedicalRecords(data.data || []);
      if (data.meta) {
        setRecordsMeta(data.meta);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch medical records";
      setError(errorMessage);
      console.error("Error fetching medical records:", err);
    }
  };

  // Fetch prescriptions with pagination
  const fetchPrescriptions = async (page = 1) => {
    try {
      const response = await api.get(`/api/prescription/patient/${patientId}`, {
        params: { page, limit: 10 },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      setPrescriptions(data.data || []);
      // Note: Prescription API might not return pagination meta, adjust if needed
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchPatient(),
        fetchMedicalRecords(recordsPage),
        fetchPrescriptions(prescriptionsPage),
      ]);
      setLoading(false);
    };
    fetchData();
  }, [patientId]);

  // Fetch data when page changes
  useEffect(() => {
    if (activeTab === "records" && recordsPage > 0) {
      fetchMedicalRecords(recordsPage);
    } else if (activeTab === "prescriptions" && prescriptionsPage > 0) {
      fetchPrescriptions(prescriptionsPage);
    }
  }, [recordsPage, prescriptionsPage, activeTab]);
  
  // Reset to page 1 when switching tabs
  useEffect(() => {
    if (activeTab === "records") {
      setRecordsPage(1);
    } else {
      setPrescriptionsPage(1);
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner
          size="large"
          variant="primary"
          showText
          text="Loading patient medical history..."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="medium"
                onClick={() => navigate(-1)}
                className="flex items-center justify-center">
                <FiArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Medical History
                </h1>
                {patient && (
                  <p className="text-gray-600 mt-1 flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    {patient.user?.name || "Unknown Patient"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Patient Info Card */}
          {patient && (
            <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">NIC</p>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {patient.nic || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Contact</p>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {patient.contact || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {patient.user?.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
              <div>
                <p className="font-semibold">Unable to load data</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("records")}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === "records"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              <div className="flex items-center gap-2">
                <FiFileText className="w-4 h-4" />
                Medical Records ({recordsMeta.total || medicalRecords.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("prescriptions")}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === "prescriptions"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              <div className="flex items-center gap-2">
                <FaPills className="w-4 h-4" />
                Prescriptions ({prescriptions.length})
              </div>
            </button>
          </div>
        </div>

        {/* Medical Records Tab */}
        {activeTab === "records" && (
          <div className="space-y-6">
            {medicalRecords.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
                <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-500 mb-2">
                  No medical records found
                </p>
                <p className="text-gray-400">
                  This patient has no medical records yet.
                </p>
              </div>
            ) : (
              medicalRecords.map((record) => (
                <div
                  key={record._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Record Header */}
                  <div className="bg-gradient-to-r from-primary-dark to-primary text-white px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FiCalendar className="w-5 h-5" />
                        <div>
                          <p className="font-semibold">
                            {formatDate(record.createdAt)}
                          </p>
                          {record.doctor?.user?.name && (
                            <p className="text-sm text-white/90">
                              Doctor: {record.doctor.user.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Vitals */}
                    {record.vitals && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <FiActivity className="text-primary" />
                          Vital Signs
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {record.vitals.temperature && (
                            <div className="bg-primary/10 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <FiThermometer className="w-4 h-4 text-primary" />
                                <p className="text-sm font-medium text-gray-600">
                                  Temperature
                                </p>
                              </div>
                              <p className="text-xl font-bold text-gray-800">
                                {record.vitals.temperature}°C
                              </p>
                            </div>
                          )}
                          {record.vitals.bloodPressure && (
                            <div className="bg-secondary/10 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <FiHeart className="w-4 h-4 text-secondary" />
                                <p className="text-sm font-medium text-gray-600">
                                  Blood Pressure
                                </p>
                              </div>
                              <p className="text-xl font-bold text-gray-800">
                                {record.vitals.bloodPressure}
                              </p>
                            </div>
                          )}
                          {record.vitals.pulse && (
                            <div className="bg-primary/10 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <FiActivity className="w-4 h-4 text-primary" />
                                <p className="text-sm font-medium text-gray-600">
                                  Pulse
                                </p>
                              </div>
                              <p className="text-xl font-bold text-gray-800">
                                {record.vitals.pulse} bpm
                              </p>
                            </div>
                          )}
                          {record.vitals.respiration && (
                            <div className="bg-secondary/10 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <FiDroplet className="w-4 h-4 text-secondary" />
                                <p className="text-sm font-medium text-gray-600">
                                  Respiration
                                </p>
                              </div>
                              <p className="text-xl font-bold text-gray-800">
                                {record.vitals.respiration} /min
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* SOAP Notes */}
                    {record.soap && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <FiFileText className="text-primary" />
                          SOAP Notes
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <p className="text-sm font-semibold text-blue-800 mb-2">
                              Subjective
                            </p>
                            <p className="text-gray-700">
                              {record.soap.subjective || "N/A"}
                            </p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <p className="text-sm font-semibold text-green-800 mb-2">
                              Objective
                            </p>
                            <p className="text-gray-700">
                              {record.soap.objective || "N/A"}
                            </p>
                          </div>
                          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                            <p className="text-sm font-semibold text-yellow-800 mb-2">
                              Assessment
                            </p>
                            <p className="text-gray-700">
                              {record.soap.assessment || "N/A"}
                            </p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                            <p className="text-sm font-semibold text-purple-800 mb-2">
                              Plan
                            </p>
                            <p className="text-gray-700">
                              {record.soap.plan || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Notes */}
                    {record.notes && (
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                          <FiFileText className="text-primary" />
                          Additional Notes
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-gray-700">{record.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            
            {/* Pagination for Medical Records */}
            {medicalRecords.length > 0 && recordsMeta.pages > 1 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {((recordsPage - 1) * recordsMeta.limit) + 1} to{" "}
                    {Math.min(recordsPage * recordsMeta.limit, recordsMeta.total)} of{" "}
                    {recordsMeta.total} records
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => setRecordsPage(prev => Math.max(1, prev - 1))}
                      disabled={recordsPage === 1}
                      className="flex items-center gap-1">
                      <FiChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <span className="px-4 py-2 text-sm font-medium text-gray-700">
                      Page {recordsPage} of {recordsMeta.pages}
                    </span>
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => setRecordsPage(prev => Math.min(recordsMeta.pages, prev + 1))}
                      disabled={recordsPage === recordsMeta.pages}
                      className="flex items-center gap-1">
                      Next
                      <FiChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Prescriptions Tab */}
        {activeTab === "prescriptions" && (
          <div className="space-y-6">
            {prescriptions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
                <FaPills className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-500 mb-2">
                  No prescriptions found
                </p>
                <p className="text-gray-400">
                  This patient has no prescriptions yet.
                </p>
              </div>
            ) : (
              prescriptions.map((prescription) => (
                <div
                  key={prescription._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Prescription Header */}
                  <div className="bg-gradient-to-r from-primary-dark to-primary text-white px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FaPills className="w-5 h-5" />
                        <div>
                          <p className="font-semibold">
                            Prescription - {formatDate(prescription.createdAt)}
                          </p>
                          {prescription.doctor?.user?.name && (
                            <p className="text-sm text-white/90">
                              Prescribed by: {prescription.doctor.user.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Prescription Items */}
                    {prescription.items && prescription.items.length > 0 ? (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <FaPills className="text-primary" />
                          Medications
                        </h3>
                        <div className="space-y-4">
                          {prescription.items.map((item, index) => (
                            <div
                              key={index}
                              className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-5 border border-primary/20">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-600 mb-1">
                                    Drug Name
                                  </p>
                                  <p className="text-lg font-semibold text-gray-800">
                                    {item.drug}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600 mb-1">
                                    Dosage
                                  </p>
                                  <p className="text-lg font-semibold text-gray-800">
                                    {item.dosage}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600 mb-1">
                                    Duration
                                  </p>
                                  <p className="text-lg font-semibold text-gray-800">
                                    {item.duration}
                                  </p>
                                </div>
                                {item.instructions && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                      Instructions
                                    </p>
                                    <p className="text-base text-gray-700">
                                      {item.instructions}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No medications in this prescription.</p>
                    )}
                  </div>
                </div>
              ))
            )}
            
            {/* Pagination for Prescriptions */}
            {prescriptions.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {prescriptions.length} prescription{prescriptions.length !== 1 ? 's' : ''}
                  </p>
                  {/* Note: Add proper pagination when API supports it */}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientMedicalHistory;
