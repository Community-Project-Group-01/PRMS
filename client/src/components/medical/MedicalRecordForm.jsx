import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaStethoscope,
  FaPills,
  FaSave,
  FaTimes,
  FaFileMedical,
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
    return <Spinner size="large" text="Creating medical record..." />;
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

// Tab Button Component (kept inline for simplicity)
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
