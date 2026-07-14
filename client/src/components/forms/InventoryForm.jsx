import React, { useState, useEffect } from "react";
import api from "../../api/client";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const INVENTORY_TYPES = ["Drug", "Medical Device", "Consumable", "Equipment", "Other"];

const emptyForm = {
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
  inventoryType: "Drug",
};

const InventoryForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [errors, setErrors] = useState({});

  const inputClass =
    "w-full border border-primary rounded-lg p-2 transition duration-150 focus:outline-none focus:ring-1 focus:ring-primary-dark focus:border-primary-dark";

  useEffect(() => {
    if (!isEditMode) return;

    const fetchItem = async () => {
      try {
        setFetching(true);
        const res = await api.get(`/api/inventory/${id}`);
        const item = res.data?.data || res.data;
        setFormData({
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
          inventoryType: item.inventoryType || "Drug",
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

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
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
    ];

    requiredFields.forEach((field) => {
      if (!String(formData[field]).trim()) {
        newErrors[field] = "This field is required.";
      }
    });

    if (formData.stockLevel === "" || Number(formData.stockLevel) < 0) {
      newErrors.stockLevel = "Stock level must be a non-negative number.";
    }
    if (!formData.inventoryType) {
      newErrors.inventoryType = "Please select an inventory type.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = { ...formData, stockLevel: Number(formData.stockLevel) };

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
      <div className="min-h-screen flex items-center justify-center bg-white">
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
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-semibold text-center text-primary-dark mb-6">
          {isEditMode ? "Edit Inventory Item" : "Add Inventory Item"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Generic Name */}
          <div>
            <label className="block mb-1 text-primary-dark">Generic Name</label>
            <input
              type="text"
              name="genericName"
              value={formData.genericName}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.genericName && (
              <p className="text-red-500 text-sm">{errors.genericName}</p>
            )}
          </div>

          {/* Brand Name */}
          <div>
            <label className="block mb-1 text-primary-dark">Brand Name</label>
            <input
              type="text"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.brandName && (
              <p className="text-red-500 text-sm">{errors.brandName}</p>
            )}
          </div>

          {/* Dosage */}
          <div>
            <label className="block mb-1 text-primary-dark">Dosage</label>
            <input
              type="text"
              name="dosage"
              placeholder="E.g. TABLETS"
              value={formData.dosage}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.dosage && (
              <p className="text-red-500 text-sm">{errors.dosage}</p>
            )}
          </div>

          {/* Inventory Type */}
          <div>
            <label className="block mb-1 text-primary-dark">Inventory Type</label>
            <select
              name="inventoryType"
              value={formData.inventoryType}
              onChange={handleChange}
              className={inputClass}>
              {INVENTORY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.inventoryType && (
              <p className="text-red-500 text-sm">{errors.inventoryType}</p>
            )}
          </div>

          {/* Pack Size */}
          <div>
            <label className="block mb-1 text-primary-dark">Pack Size</label>
            <input
              type="text"
              name="packSize"
              placeholder="E.g. 1X10,3X10,5X10,10X10"
              value={formData.packSize}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.packSize && (
              <p className="text-red-500 text-sm">{errors.packSize}</p>
            )}
          </div>

          {/* Pack Type */}
          <div>
            <label className="block mb-1 text-primary-dark">Pack Type</label>
            <input
              type="text"
              name="packType"
              placeholder="E.g. ALU ALU BLISTER"
              value={formData.packType}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.packType && (
              <p className="text-red-500 text-sm">{errors.packType}</p>
            )}
          </div>

          {/* Manufacturer */}
          <div>
            <label className="block mb-1 text-primary-dark">Manufacturer</label>
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.manufacturer && (
              <p className="text-red-500 text-sm">{errors.manufacturer}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block mb-1 text-primary-dark">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.country && (
              <p className="text-red-500 text-sm">{errors.country}</p>
            )}
          </div>

          {/* Agent */}
          <div>
            <label className="block mb-1 text-primary-dark">Agent</label>
            <input
              type="text"
              name="agent"
              value={formData.agent}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.agent && (
              <p className="text-red-500 text-sm">{errors.agent}</p>
            )}
          </div>

          {/* Registration Date */}
          <div>
            <label className="block mb-1 text-primary-dark">
              Registration Date
            </label>
            <input
              type="date"
              name="regDate"
              value={formData.regDate}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.regDate && (
              <p className="text-red-500 text-sm">{errors.regDate}</p>
            )}
          </div>

          {/* Registration Number */}
          <div>
            <label className="block mb-1 text-primary-dark">
              Registration No.
            </label>
            <input
              type="text"
              name="regNo"
              value={formData.regNo}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.regNo && (
              <p className="text-red-500 text-sm">{errors.regNo}</p>
            )}
          </div>

          {/* Schedule */}
          <div>
            <label className="block mb-1 text-primary-dark">Schedule</label>
            <input
              type="text"
              name="schedule"
              placeholder="E.g. II B"
              value={formData.schedule}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.schedule && (
              <p className="text-red-500 text-sm">{errors.schedule}</p>
            )}
          </div>

          {/* Registration Type */}
          <div>
            <label className="block mb-1 text-primary-dark">
              Registration Type
            </label>
            <input
              type="text"
              name="regiType"
              placeholder="E.g. Full"
              value={formData.regiType}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.regiType && (
              <p className="text-red-500 text-sm">{errors.regiType}</p>
            )}
          </div>

          {/* Dossier Number */}
          <div>
            <label className="block mb-1 text-primary-dark">Dossier No.</label>
            <input
              type="text"
              name="dossierNo"
              value={formData.dossierNo}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.dossierNo && (
              <p className="text-red-500 text-sm">{errors.dossierNo}</p>
            )}
          </div>

          {/* Stock Level */}
          <div>
            <label className="block mb-1 text-primary-dark">Stock Level</label>
            <input
              type="number"
              name="stockLevel"
              min="0"
              placeholder="Number of units in stock"
              value={formData.stockLevel}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.stockLevel && (
              <p className="text-red-500 text-sm">{errors.stockLevel}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-between items-center mt-6">
            <Button
              type="button"
              onClick={() => navigate(-1)}
              size="medium"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-6 py-2 rounded-lg transition duration-200">
              Back
            </Button>

            <Button
              type="submit"
              disabled={loading}
              size="medium"
              className={`text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-200 ${
                loading
                  ? "bg-secondary-dark opacity-70"
                  : "bg-primary hover:bg-primary-dark"
              }`}>
              {loading
                ? isEditMode
                  ? "Saving..."
                  : "Creating..."
                : isEditMode
                ? "Save Changes"
                : "Add Item"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;
