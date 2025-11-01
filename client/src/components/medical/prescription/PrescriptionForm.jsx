// components/medical/prescriptions/PrescriptionForm.jsx
import React from "react";
import { FaPills, FaTimes } from "react-icons/fa";
import Button from "../../common/Button";

const PrescriptionItem = ({ index, prescription, onUpdate, onRemove }) => (
  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
    <div className="flex justify-between items-start mb-4">
      <h4 className="font-medium text-gray-800">Medication #{index + 1}</h4>
      <Button
        type="button"
        variant="outline"
        size="small"
        onClick={() => onRemove(index)}>
        <FaTimes />
      </Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Drug Name *
        </label>
        <input
          type="text"
          value={prescription.drug}
          onChange={(e) => onUpdate(index, "drug", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="e.g., Amoxicillin"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dosage *
        </label>
        <input
          type="text"
          value={prescription.dosage}
          onChange={(e) => onUpdate(index, "dosage", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="e.g., 500mg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Duration *
        </label>
        <input
          type="text"
          value={prescription.duration}
          onChange={(e) => onUpdate(index, "duration", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="e.g., 7 days"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instructions
        </label>
        <input
          type="text"
          value={prescription.instructions}
          onChange={(e) => onUpdate(index, "instructions", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="e.g., Take twice daily with food"
        />
      </div>
    </div>
  </div>
);

const PrescriptionForm = ({ prescriptions, onAdd, onUpdate, onRemove }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-800">Medications</h3>
      <Button
        className="flex justify-center items-center"
        type="button"
        variant="primary"
        size="small"
        onClick={onAdd}>
        <FaPills className="mr-2" />
        Add Medication
      </Button>
    </div>

    {prescriptions.length === 0 ? (
      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
        <FaPills className="mx-auto text-4xl text-gray-400 mb-3" />
        <p className="text-gray-500">No medications added yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Click "Add Medication" to get started
        </p>
      </div>
    ) : (
      <div className="space-y-4">
        {prescriptions.map((prescription, index) => (
          <PrescriptionItem
            key={index}
            index={index}
            prescription={prescription}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        ))}
      </div>
    )}
  </div>
);

export default PrescriptionForm;
