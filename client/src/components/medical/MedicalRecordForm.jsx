import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaStethoscope,
  FaPills,
  FaSave,
  FaTimes,
  FaFileMedical,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaIdCard,
  FaAllergies,
  FaBirthdayCake,
} from "react-icons/fa";
import api from "../../api/client";
import Spinner from "../common/Spinner";
import Button from "../common/Button";
import SOAPForm from "./soap/SoapForm";
import PrescriptionForm from "./prescription/PrescriptionForm";
import VitalsForm from "./vitals/VitalsForm";
import { useNavigate, useParams } from "react-router-dom";

const MedicalRecordForm = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("soap");
  const [formData, setFormData] = useState({
    soap: {
      subjective: "",
      objective: "",
      assessment: "",
      plan: "",
    },
    vitals: {
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      respiratoryRate: "",
      oxygenSaturation: "",
    },
    notes: "",
    prescriptions: [],
  });

  // Calculate age from date of birth
  const calculateAge = (dob) => {
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

  // Format date to readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Fetch patient by ID
  const fetchPatientById = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/patient/getPatient/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = response.data;
      setPatient(data.data || data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch patient details";
      console.error("Error fetching patient:", err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientById(patientId);
  }, []);

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSOAPChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      soap: {
        ...prev.soap,
        [field]: value,
      },
    }));
  };

  const addPrescription = () => {
    setFormData((prev) => ({
      ...prev,
      prescriptions: [
        ...prev.prescriptions,
        {
          drug: "",
          dosage: "",
          instructions: "",
          duration: "",
        },
      ],
    }));
  };

  const updatePrescription = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      prescriptions: prev.prescriptions.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removePrescription = (index) => {
    setFormData((prev) => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const { soap, prescriptions } = formData;

    if (!soap.subjective || !soap.objective || !soap.assessment || !soap.plan) {
      toast.error("All SOAP sections are required");
      return false;
    }

    for (const prescription of prescriptions) {
      if (
        !prescription.drug ||
        !prescription.dosage ||
        !prescription.duration
      ) {
        toast.error(
          "All prescription items require drug, dosage, and duration"
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await api.post(`/api/med/add/${patientId}`, formData);
      toast.success("Medical record created successfully!");
      navigate("/dashboard/doctor/patients");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create medical record"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner
          size="large"
          variant="primary"
          showText
          text="Loading Consultations..."
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto my-5 border-1 border-primary-dark/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FaFileMedical className="text-primary text-2xl" />
          <h2 className="text-2xl font-bold text-gray-800">Medical Record</h2>
        </div>
        <Button
          className="flex justify-center items-center"
          variant="outline"
          size="small"
          onClick={() => navigate(-1)}
          disabled={loading}>
          <FaTimes className="mr-2" />
          Cancel
        </Button>
      </div>

      {/* Patient Information Card */}
      {patient && (
        <div className="bg-primary/5 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <FaUser className="mr-2 text-secondary-dark" />
            Patient Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-700 w-24">Name:</span>
                <span className="text-gray-900">{patient.user?.name}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-700 w-24">Age:</span>
                <span className="text-gray-900 flex items-center">
                  {calculateAge(patient.dob) || patient.age} years
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-700 w-24">DOB:</span>
                <span className="text-gray-900">{formatDate(patient.dob)}</span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-700 w-24">Contact:</span>
                <span className="text-gray-900 flex items-center">
                  <FaPhone className="mr-1 text-gray-500" />
                  {patient.contact}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-700 w-24">NIC:</span>
                <span className="text-gray-900 flex items-center">
                  <FaIdCard className="mr-1 text-gray-500" />
                  {patient.nic}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-700 w-24">Type:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    patient.patientType === "public"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                  {patient.patientType}
                </span>
              </div>
            </div>

            {/* Address & Allergies */}
            <div className="space-y-2">
              <div className="flex items-start text-sm">
                <span className="font-medium text-gray-700 w-24">Address:</span>
                <span className="text-gray-900 flex items-start">
                  <FaMapMarkerAlt className="mr-1 text-gray-500 mt-0.5 flex-shrink-0" />
                  {patient.address}
                </span>
              </div>
              <div className="flex items-start text-sm">
                <span className="font-medium text-gray-700 w-24">
                  Allergies:
                </span>
                <span className="text-gray-900">
                  {patient.allergies && patient.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {patient.allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          <FaAllergies className="mr-1" />
                          {allergy}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">No known allergies</span>
                  )}
                </span>
              </div>
             
            </div>
             <Button
                variant="primary"
                size="medium"
                className="w-fit flex items-center justify-center bg-primary hover:bg-primary-dark"
                onClick={() => {
                  navigate(`/dashboard/doctor/patient/${patientId}/records`);
                }}>
                View More
              </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <TabButton
          active={activeTab === "soap"}
          onClick={() => setActiveTab("soap")}
          icon={<FaStethoscope />}>
          SOAP Notes
        </TabButton>
        <TabButton
          active={activeTab === "prescriptions"}
          onClick={() => setActiveTab("prescriptions")}
          icon={<FaPills />}>
          Prescriptions
        </TabButton>
        <TabButton
          active={activeTab === "vitals"}
          onClick={() => setActiveTab("vitals")}
          icon={<FaStethoscope />}>
          Vitals
        </TabButton>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Render Tab Content */}
        {activeTab === "soap" && (
          <SOAPForm data={formData.soap} onChange={handleSOAPChange} />
        )}

        {activeTab === "prescriptions" && (
          <PrescriptionForm
            prescriptions={formData.prescriptions}
            onAdd={addPrescription}
            onUpdate={updatePrescription}
            onRemove={removePrescription}
          />
        )}

        {activeTab === "vitals" && (
          <VitalsForm
            data={formData.vitals}
            onChange={(field, value) =>
              handleInputChange("vitals", field, value)
            }
          />
        )}

        {/* Additional Notes */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Any additional notes or comments..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <Button
            className="flex justify-center items-center"
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={loading}>
            Cancel
          </Button>
          <Button
            className="flex justify-center items-center"
            type="submit"
            variant="primary"
            loading={loading}>
            <FaSave className="mr-2" />
            Save Medical Record
          </Button>
        </div>
      </form>
    </div>
  );
};

// Tab Button Component
const TabButton = ({ active, onClick, icon, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center cursor-pointer space-x-2 px-4 py-3 font-medium border-b-2 transition-colors ${
      active
        ? "border-primary text-primary"
        : "border-transparent text-gray-500 hover:text-gray-700"
    }`}>
    {icon}
    <span>{children}</span>
  </button>
);

export default MedicalRecordForm;
