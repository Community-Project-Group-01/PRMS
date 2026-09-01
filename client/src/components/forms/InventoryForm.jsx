import React, { useState, useEffect, useMemo } from "react";
import api from "../../api/client";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiLayers, FiPackage, FiInfo } from "react-icons/fi";

const INVENTORY_TYPES = [
  "Medicine",
  "Material",
  "Medical Device",
  "Consumable",
  "Equipment",
  "Diagnostic",
  "Other",
];

// Configuration of fields and requirements per inventory type
const TYPE_CONFIG = {
  Medicine: {
    title: "Medicine Details",
    description: "Pharmaceutical drug information and regulatory specifications",
    requiredFields: [
      "genericName",
      "brandName",
      "dosage",
      "packSize",
      "packType",
      "manufacturer",
      "country",
      "agent",
      "regDate",
      "regNo",
      "schedule",
      "regiType",
      "dossierNo",
    ],
    fields: [
      {
        name: "genericName",
        label: "Generic Name",
        required: true,
        type: "text",
        placeholder: "E.g. Paracetamol, Amoxicillin",
      },
      {
        name: "brandName",
        label: "Brand Name",
        required: true,
        type: "text",
        placeholder: "E.g. Panadol 500mg, Amoxil",
      },
      {
        name: "dosage",
        label: "Dosage / Strength",
        required: true,
        type: "text",
        placeholder: "E.g. 500mg TABLETS, 250mg/5ml SYRUP",
      },
      {
        name: "schedule",
        label: "Schedule",
        required: true,
        type: "text",
        placeholder: "E.g. II B, POM, OTC",
      },
      {
        name: "packSize",
        label: "Pack Size",
        required: true,
        type: "text",
        placeholder: "E.g. 1X10, 3X10, 10X10, 100 Tablets",
      },
      {
        name: "packType",
        label: "Pack Type",
        required: true,
        type: "text",
        placeholder: "E.g. ALU ALU BLISTER, HDPE Bottle",
      },
      {
        name: "manufacturer",
        label: "Manufacturer",
        required: true,
        type: "text",
        placeholder: "E.g. State Pharmaceuticals Mfg Corp",
      },
      {
        name: "country",
        label: "Country of Origin",
        required: true,
        type: "text",
        placeholder: "E.g. Sri Lanka, India, Germany",
      },
      {
        name: "agent",
        label: "Agent / Distributor",
        required: true,
        type: "text",
        placeholder: "E.g. MediLink Healthcare Ltd",
      },
      {
        name: "regDate",
        label: "Registration Date",
        required: true,
        type: "date",
      },
      {
        name: "regNo",
        label: "Registration No.",
        required: true,
        type: "text",
        placeholder: "E.g. NMRA/DR/2024/001",
      },
      {
        name: "regiType",
        label: "Registration Type",
        required: true,
        type: "text",
        placeholder: "E.g. Full, Provisional",
      },
      {
        name: "dossierNo",
        label: "Dossier No.",
        required: true,
        type: "text",
        placeholder: "E.g. DOS/2024/889",
      },
      {
        name: "stockLevel",
        label: "Stock Level",
        required: true,
        type: "number",
        min: 0,
        placeholder: "Total units in stock",
      },
    ],
  },
  Material: {
    title: "Material Details",
    description: "Medical materials, raw clinical supplies, and dressings",
    requiredFields: ["brandName", "manufacturer"],
    fields: [
      {
        name: "brandName",
        label: "Material / Item Name",
        required: true,
        type: "text",
        placeholder: "E.g. Sterile Absorbent Cotton Roll, Gauze Bandage",
      },
      {
        name: "manufacturer",
        label: "Manufacturer / Brand",
        required: true,
        type: "text",
        placeholder: "E.g. HealthCare Supplies Co.",
      },
      {
        name: "packSize",
        label: "Pack Size / Quantity",
        required: false,
        type: "text",
        placeholder: "E.g. 500g Roll, 10 Rolls/Pack",
      },
      {
        name: "packType",
        label: "Pack Type / Packaging",
        required: false,
        type: "text",
        placeholder: "E.g. Sealed Bag, Box, Roll",
      },
      {
        name: "country",
        label: "Country of Origin",
        required: false,
        type: "text",
        placeholder: "E.g. Sri Lanka, India",
      },
      {
        name: "agent",
        label: "Supplier / Agent",
        required: false,
        type: "text",
        placeholder: "E.g. Lanka Med Supply Ltd",
      },
      {
        name: "stockLevel",
        label: "Stock Level",
        required: true,
        type: "number",
        min: 0,
        placeholder: "Available units in stock",
      },
    ],
  },
  "Medical Device": {
    title: "Medical Device Details",
    description: "Clinical diagnostic devices, monitors, and instruments",
    requiredFields: ["brandName", "manufacturer"],
    fields: [
      {
        name: "brandName",
        label: "Device Name",
        required: true,
        type: "text",
        placeholder: "E.g. Digital Blood Pressure Monitor, Pulse Oximeter",
      },
      {
        name: "manufacturer",
        label: "Manufacturer",
        required: true,
        type: "text",
        placeholder: "E.g. Omron Healthcare, Philips",
      },
      {
        name: "regNo",
        label: "Model / Serial / Reg No.",
        required: false,
        type: "text",
        placeholder: "E.g. HEM-7120 / SN-2024881",
      },
      {
        name: "regDate",
        label: "Registration / Acquired Date",
        required: false,
        type: "date",
      },
      {
        name: "country",
        label: "Country of Origin",
        required: false,
        type: "text",
        placeholder: "E.g. Japan, Germany",
      },
      {
        name: "agent",
        label: "Supplier / Agent",
        required: false,
        type: "text",
        placeholder: "E.g. MedTech Solutions",
      },
      {
        name: "stockLevel",
        label: "Stock Level / Units",
        required: true,
        type: "number",
        min: 0,
        placeholder: "Number of devices in stock",
      },
    ],
  },
  Consumable: {
    title: "Consumable Details",
    description: "Single-use medical consumables and disposable items",
    requiredFields: ["brandName", "manufacturer"],
    fields: [
      {
        name: "brandName",
        label: "Consumable Name",
        required: true,
        type: "text",
        placeholder: "E.g. Disposable Nitrile Gloves (Medium), 5ml Syringes",
      },
      {
        name: "manufacturer",
        label: "Manufacturer / Brand",
        required: true,
        type: "text",
        placeholder: "E.g. BD Medical, Ansell",
      },
      {
        name: "packSize",
        label: "Pack Size",
        required: false,
        type: "text",
        placeholder: "E.g. Box of 100 pcs, 50 units/pack",
      },
      {
        name: "packType",
        label: "Pack Type",
        required: false,
        type: "text",
        placeholder: "E.g. Box, Packet, Carton",
      },
      {
        name: "country",
        label: "Country of Origin",
        required: false,
        type: "text",
        placeholder: "E.g. Malaysia, Sri Lanka",
      },
      {
        name: "agent",
        label: "Supplier / Agent",
        required: false,
        type: "text",
        placeholder: "E.g. Apex Health Logistics",
      },
      {
        name: "stockLevel",
        label: "Stock Level",
        required: true,
        type: "number",
        min: 0,
        placeholder: "Available units in stock",
      },
    ],
  },
  Equipment: {
    title: "Equipment Details",
    description: "Hospital & clinic apparatus, machinery, and equipment",
    requiredFields: ["brandName", "manufacturer"],
    fields: [
      {
        name: "brandName",
        label: "Equipment Name",
        required: true,
        type: "text",
        placeholder: "E.g. 12-Lead ECG Machine, Autoclave Sterilizer 20L",
      },
      {
        name: "manufacturer",
        label: "Manufacturer",
        required: true,
        type: "text",
        placeholder: "E.g. GE Healthcare, Mindray",
      },
      {
        name: "regNo",
        label: "Model / Serial No.",
        required: false,
        type: "text",
        placeholder: "E.g. MAC-2000 / EQ-9920",
      },
      {
        name: "regDate",
        label: "Installation / Acquisition Date",
        required: false,
        type: "date",
      },
      {
        name: "country",
        label: "Country of Origin",
        required: false,
        type: "text",
        placeholder: "E.g. USA, Germany, Japan",
      },
      {
        name: "agent",
        label: "Supplier / Service Agent",
        required: false,
        type: "text",
        placeholder: "E.g. MedEquipment Lanka",
      },
      {
        name: "stockLevel",
        label: "Stock Level / Units Available",
        required: true,
        type: "number",
        min: 0,
        placeholder: "Available units",
      },
    ],
  },
  Diagnostic: {
    title: "Diagnostic Item Details",
    description: "Diagnostic kits, test strips, reagents, and screening tools",
    requiredFields: ["brandName", "manufacturer"],
    fields: [
      {
        name: "brandName",
        label: "Diagnostic Kit / Item Name",
        required: true,
        type: "text",
        placeholder: "E.g. Dengue NS1 Rapid Antigen Kit, Blood Glucose Strips",
      },
      {
        name: "manufacturer",
        label: "Manufacturer",
        required: true,
        type: "text",
        placeholder: "E.g. Abbott, Roche Diagnostics",
      },
      {
        name: "packSize",
        label: "Pack Size / Test Count",
        required: false,
        type: "text",
        placeholder: "E.g. 25 Tests/Kit, 50 Strips/Box",
      },
      {
        name: "packType",
        label: "Pack Type",
        required: false,
        type: "text",
        placeholder: "E.g. Kit Box, Cassette Pack, Vial",
      },
      {
        name: "regNo",
        label: "Registration / Lot No.",
        required: false,
        type: "text",
        placeholder: "E.g. LOT-202409, NMRA/DG/102",
      },
      {
        name: "regDate",
        label: "Registration / Expiry Date",
        required: false,
        type: "date",
      },
      {
        name: "country",
        label: "Country of Origin",
        required: false,
        type: "text",
        placeholder: "E.g. USA, Germany, South Korea",
      },
      {
        name: "agent",
        label: "Supplier / Agent",
        required: false,
        type: "text",
        placeholder: "E.g. Diagnostics Global",
      },
      {
        name: "stockLevel",
        label: "Stock Level",
        required: true,
        type: "number",
        min: 0,
        placeholder: "Available test kits/units",
      },
    ],
  },
  Other: {
    title: "General Item Details",
    description: "General clinic inventory and miscellaneous supplies",
    requiredFields: ["brandName"],
    fields: [
      {
        name: "brandName",
        label: "Item Name",
        required: true,
        type: "text",
        placeholder: "E.g. Examination Bed Sheets, Sanitizer 5L",
      },
      {
        name: "manufacturer",
        label: "Manufacturer / Brand",
        required: false,
        type: "text",
        placeholder: "Manufacturer (Optional)",
      },
      {
        name: "packSize",
        label: "Pack Size / Unit Details",
        required: false,
        type: "text",
        placeholder: "E.g. 5L Can, Pack of 20 (Optional)",
      },
      {
        name: "packType",
        label: "Pack Type",
        required: false,
        type: "text",
        placeholder: "E.g. Bottle, Box, Canister (Optional)",
      },
      {
        name: "country",
        label: "Country of Origin",
        required: false,
        type: "text",
        placeholder: "Country of origin (Optional)",
      },
      {
        name: "agent",
        label: "Supplier / Agent",
        required: false,
        type: "text",
        placeholder: "Supplier or vendor (Optional)",
      },
      {
        name: "stockLevel",
        label: "Stock Level",
        required: true,
        type: "number",
        min: 0,
        placeholder: "Number of units in stock",
      },
    ],
  },
};

const emptyForm = {
  inventoryType: "Medicine",
  genericName: "",
  brandName: "",
  dosage: "",
  packSize: "",
  packType: "",
  manufacturer: "",
  country: "",
  agent: "",
  regDate: "",
  regNo: "",
  schedule: "",
  regiType: "",
  dossierNo: "",
  stockLevel: "",
};

const InventoryForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [errors, setErrors] = useState({});

  const currentType = formData.inventoryType || "Medicine";
  const typeConfig = useMemo(() => {
    return TYPE_CONFIG[currentType] || TYPE_CONFIG.Other;
  }, [currentType]);

  const inputClass =
    "w-full border border-gray-300 rounded-lg p-2.5 text-sm transition duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-gray-800";

  useEffect(() => {
    if (!isEditMode) return;

    const fetchItem = async () => {
      try {
        setFetching(true);
        const res = await api.get(`/api/inventory/${id}`);
        const item = res.data?.data || res.data;
        const normalizedType =
          item.inventoryType === "Drug"
            ? "Medicine"
            : item.inventoryType || "Medicine";

        setFormData({
          inventoryType: normalizedType,
          genericName: item.genericName || "",
          brandName: item.brandName || "",
          dosage: item.dosage || "",
          packSize: item.packSize || "",
          packType: item.packType || "",
          manufacturer: item.manufacturer || "",
          country: item.country || "",
          agent: item.agent || "",
          regDate: item.regDate ? item.regDate.slice(0, 10) : "",
          regNo: item.regNo || "",
          schedule: item.schedule || "",
          regiType: item.regiType || "",
          dossierNo: item.dossierNo || "",
          stockLevel: item.stockLevel ?? "",
        });
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to load inventory item";
        toast.error(message);
        navigate("/dashboard/admin/inventory");
      } finally {
        setFetching(false);
      }
    };

    fetchItem();
  }, [id, isEditMode, navigate]);

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      inventoryType: newType,
    }));
    // Clear errors when type changes
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = typeConfig.requiredFields || ["brandName"];

    requiredFields.forEach((field) => {
      const val = formData[field];
      if (val === undefined || val === null || !String(val).trim()) {
        newErrors[field] = "This field is required.";
      }
    });

    if (formData.stockLevel === "" || isNaN(Number(formData.stockLevel)) || Number(formData.stockLevel) < 0) {
      newErrors.stockLevel = "Stock level must be a non-negative number.";
    }

    if (!formData.inventoryType) {
      newErrors.inventoryType = "Please select an inventory type.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please complete all required fields.");
      return;
    }

    setLoading(true);
    try {
      // Build clean payload with only fields relevant to the selected inventory type
      const activeFieldNames = typeConfig.fields.map((f) => f.name);
      const payload = {
        inventoryType: formData.inventoryType,
        stockLevel: Number(formData.stockLevel) || 0,
      };

      activeFieldNames.forEach((fieldName) => {
        if (fieldName === "stockLevel") return;
        const val = formData[fieldName];
        if (fieldName === "regDate") {
          payload[fieldName] = val ? val : null;
        } else {
          payload[fieldName] = val !== undefined ? String(val).trim() : "";
        }
      });

      if (isEditMode) {
        await api.put(`/api/inventory/${id}`, payload);
        toast.success("Inventory item updated successfully!");
      } else {
        await api.post("/api/inventory", payload);
        toast.success("Inventory item created successfully!");
      }

      navigate("/dashboard/admin/inventory");
    } catch (error) {
      const backendError =
        error.response?.data?.message ||
        "Failed to save inventory item. Please try again.";
      toast.error(backendError);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner
          size="large"
          variant="primary"
          showText
          text="Loading inventory item..."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-2xl border border-gray-100 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-primary to-secondary px-8 py-6 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
                <FiPackage className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {isEditMode ? "Edit Inventory Item" : "Add Inventory Item"}
                </h2>
                <p className="text-sm text-white/90 mt-0.5">
                  {isEditMode
                    ? `Update specifications and stock for ${formData.brandName || "item"}`
                    : "Fill in the required information to register a new inventory item"}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* 1. FIRST FIELD: INVENTORY TYPE SELECTION */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <FiLayers className="text-primary w-4 h-4" />
                  Inventory Classification / Type{" "}
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-primary font-medium bg-white px-2.5 py-1 rounded-full border border-primary/20">
                  Step 1: Select Type to customize input fields
                </span>
              </div>

              <select
                name="inventoryType"
                value={formData.inventoryType}
                onChange={handleTypeChange}
                className="w-full border-2 border-primary/30 rounded-lg p-3 text-sm font-semibold text-gray-800 bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all cursor-pointer">
                {INVENTORY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              {errors.inventoryType && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">
                  {errors.inventoryType}
                </p>
              )}

              {/* Dynamic Type Description Banner */}
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-600">
                <FiInfo className="text-primary w-4 h-4 flex-shrink-0" />
                <span>
                  <strong>{typeConfig.title}:</strong> {typeConfig.description}.
                  Fields below are dynamically configured for{" "}
                  <span className="font-semibold text-primary">
                    {formData.inventoryType}
                  </span>
                  .
                </span>
              </div>
            </div>

            {/* 2. DYNAMIC INPUT FIELDS GRID */}
            <div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-5">
                <h3 className="text-base font-semibold text-gray-800">
                  {typeConfig.title}
                </h3>
                <span className="text-xs text-gray-500">
                  <span className="text-red-500 font-bold">*</span> Indicates
                  required field
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {typeConfig.fields.map((field) => {
                  const isRequired = field.required;
                  return (
                    <div key={field.name} className="col-span-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        {field.label}{" "}
                        {isRequired && (
                          <span className="text-red-500 font-bold">*</span>
                        )}
                      </label>

                      <input
                        type={field.type || "text"}
                        name={field.name}
                        min={field.min}
                        placeholder={field.placeholder || ""}
                        value={formData[field.name] ?? ""}
                        onChange={handleChange}
                        className={`${inputClass} ${
                          errors[field.name]
                            ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                            : ""
                        }`}
                      />

                      {errors[field.name] && (
                        <p className="text-red-500 text-xs mt-1 font-medium">
                          {errors[field.name]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 pt-6 border-t border-gray-100">
              <Button
                type="button"
                onClick={() => navigate(-1)}
                size="medium"
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded-xl transition duration-200">
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                size="medium"
                className={`w-full sm:w-auto text-white font-semibold px-8 py-2.5 rounded-xl shadow-md transition duration-200 ${
                  loading
                    ? "bg-secondary-dark opacity-70 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark"
                }`}>
                {loading
                  ? isEditMode
                    ? "Saving Changes..."
                    : "Registering Item..."
                  : isEditMode
                  ? "Update Inventory"
                  : "Add to Inventory"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InventoryForm;
