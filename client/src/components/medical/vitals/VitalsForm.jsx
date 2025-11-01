// components/medical/vitals/VitalsForm.jsx
import React from "react";

const VitalInput = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      placeholder={placeholder}
    />
  </div>
);

const VitalsForm = ({ data, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <VitalInput
      label="Blood Pressure"
      value={data.bloodPressure}
      onChange={(value) => onChange("bloodPressure", value)}
      placeholder="e.g., 120/80"
    />

    <VitalInput
      label="Heart Rate (bpm)"
      value={data.heartRate}
      onChange={(value) => onChange("heartRate", value)}
      placeholder="e.g., 72"
    />

    <VitalInput
      label="Temperature (°C)"
      value={data.temperature}
      onChange={(value) => onChange("temperature", value)}
      placeholder="e.g., 37.0"
    />

    <VitalInput
      label="Respiratory Rate"
      value={data.respiratoryRate}
      onChange={(value) => onChange("respiratoryRate", value)}
      placeholder="e.g., 16"
    />

    <VitalInput
      label="O₂ Saturation (%)"
      value={data.oxygenSaturation}
      onChange={(value) => onChange("oxygenSaturation", value)}
      placeholder="e.g., 98"
    />
  </div>
);

export default VitalsForm;
