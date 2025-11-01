// components/medical/soap/SOAPForm.jsx
import React from "react";

const SOAPSection = ({ title, description, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {title}
      <span className="text-xs text-gray-500 font-normal ml-2">
        {description}
      </span>
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      placeholder={placeholder}
      required
    />
  </div>
);

const SOAPForm = ({ data, onChange }) => (
  <div className="space-y-6">
    <SOAPSection
      title="Subjective (S)"
      description="Patient's complaints, symptoms, history"
      value={data.subjective}
      onChange={(value) => onChange("subjective", value)}
      placeholder="Patient reports..."
    />

    <SOAPSection
      title="Objective (O)"
      description="Observations, test results, physical findings"
      value={data.objective}
      onChange={(value) => onChange("objective", value)}
      placeholder="Physical examination reveals..."
    />

    <SOAPSection
      title="Assessment (A)"
      description="Diagnosis, analysis, evaluation"
      value={data.assessment}
      onChange={(value) => onChange("assessment", value)}
      placeholder="Assessment indicates..."
    />

    <SOAPSection
      title="Plan (P)"
      description="Treatment plan, follow-up, recommendations"
      value={data.plan}
      onChange={(value) => onChange("plan", value)}
      placeholder="Plan includes..."
    />
  </div>
);

export default SOAPForm;
