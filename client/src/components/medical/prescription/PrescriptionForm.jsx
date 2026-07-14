// components/medical/prescriptions/PrescriptionForm.jsx
import React, { useEffect, useState } from "react";
import { FaPills, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import Button from "../../common/Button";
import api from "../../../api/client";

const PrescriptionItem = ({
  index,
  prescription,
  onUpdate,
  onRemove,
  drugs,
  loadingDrugs,
}) => {
  const selectedDrug = drugs.find((drug) => drug.brandName === prescription.drug);
  const showNoStockWarning =
    prescription.drug && (!selectedDrug || selectedDrug.stockLevel <= 0);

  return (
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
            Drug Name (Brand) *
          </label>
          <select
            value={prescription.drug}
            onChange={(e) => onUpdate(index, "drug", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={loadingDrugs}
            required>
            <option value="">
              {loadingDrugs ? "Loading drugs..." : "Select a drug"}
            </option>
            {drugs.map((drug) => (
              <option key={drug._id} value={drug.brandName}>
                {drug.brandName} ({drug.genericName})
              </option>
            ))}
          </select>
          {showNoStockWarning && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <FaExclamationTriangle className="flex-shrink-0" />
              No Stock Available — patient may need to purchase from another
              pharmacy
            </p>
          )}
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
};

const PrescriptionForm = ({ prescriptions, onAdd, onUpdate, onRemove }) => {
  const [drugs, setDrugs] = useState([]);
  const [loadingDrugs, setLoadingDrugs] = useState(true);

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const response = await api.get("/api/inventory");
        const data = response.data;
        setDrugs(data.data || []);
      } catch (error) {
        console.error("Error fetching inventory drugs:", error);
      } finally {
        setLoadingDrugs(false);
      }
    };

    fetchDrugs();
  }, []);

  return (
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
              drugs={drugs}
              loadingDrugs={loadingDrugs}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PrescriptionForm;
