import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiPlusCircle,
  FiX,
  FiEdit2,
  FiTrash2,
  FiPackage,
  FiAlertTriangle,
  FiTag,
} from "react-icons/fi";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import api from "../../api/client";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      setError(null);

      const response = await api.get("/api/inventory");
      const data = response.data;

      const inventoryData = data.data || data || [];
      setItems(inventoryData);
      setFilteredItems(inventoryData);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch inventory";
      setError(errorMessage);
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredItems(items);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = items.filter(
        (item) =>
          item.brandName?.toLowerCase().includes(term) ||
          item.genericName?.toLowerCase().includes(term) ||
          item.manufacturer?.toLowerCase().includes(term) ||
          item.inventoryType?.toLowerCase().includes(term)
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, items]);

  const handleViewDetails = (item) => setSelectedItem(item);

  const handleRefresh = () => fetchInventory();

  const handleAddInventory = () => navigate("/dashboard/admin/add-inventory");

  const handleEdit = (e, item) => {
    e.stopPropagation();
    navigate(`/dashboard/admin/edit-inventory/${item._id}`);
  };

  const handleDelete = async (e, item) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      `Delete "${item.brandName}" from inventory? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setDeletingId(item._id);
      await api.delete(`/api/inventory/${item._id}`);
      toast.success("Inventory item deleted successfully");
      setSelectedItem(null);
      setItems((prev) => prev.filter((i) => i._id !== item._id));
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete inventory item";
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const outOfStockCount = items.filter((item) => item.stockLevel <= 0).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner
          size="large"
          variant="primary"
          showText
          text="Loading inventory..."
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
                  placeholder="Search by brand name, generic name, manufacturer, or type..."
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
                onClick={handleAddInventory}
                className="min-w-[140px] flex items-center justify-center bg-primary hover:bg-primary-dark">
                <FiPlusCircle className="w-4 h-4 mr-2" />
                Add Item
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
                <p className="font-semibold">Unable to load inventory</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {!error && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Items
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {items.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <FiPackage className="w-6 h-6 text-primary" />
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
                    {filteredItems.length}
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
                    Out of Stock
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {outOfStockCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FiAlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Brand / Generic Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Dosage
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Manufacturer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Stock Level
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FiSearch className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-xl font-semibold text-gray-500 mb-2">
                          No inventory items found
                        </p>
                        <p className="text-gray-400 max-w-md">
                          {searchTerm
                            ? `No results found for "${searchTerm}". Try adjusting your search terms.`
                            : "No inventory records available."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-primary/5 transition-colors cursor-pointer group"
                      onClick={() => handleViewDetails(item)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:shadow-md transition-shadow">
                            {item.brandName?.charAt(0).toUpperCase() || "I"}
                          </div>
                          <div>
                            <span className="text-base font-semibold text-gray-800 group-hover:text-primary transition-colors block">
                              {item.brandName || "Unnamed Item"}
                            </span>
                            {item.genericName && (
                              <span className="text-sm text-gray-500 block mt-1">
                                {item.genericName}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {item.dosage || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {item.manufacturer || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary-dark">
                          {item.inventoryType || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.stockLevel > 0 ? (
                          <span className="inline-flex text-nowrap items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {item.stockLevel} in stock
                          </span>
                        ) : (
                          <span className="inline-flex text-nowrap items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                           Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => handleEdit(e, item)}
                            title="Edit item"
                            className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors">
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, item)}
                            disabled={deletingId === item._id}
                            title="Delete item"
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {filteredItems.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-semibold text-gray-800">
                    {filteredItems.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-800">
                    {items.length}
                  </span>{" "}
                  items
                </p>
                <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border">
                  Click on any row to view details
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Item Details Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-2xl">
                      {selectedItem.brandName?.charAt(0).toUpperCase() || "I"}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedItem.brandName}
                      </h2>
                      <p className="text-white/90 text-sm">
                        {selectedItem.genericName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-white hover:text-white/80 text-2xl p-2 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center w-10 h-10">
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                {/* Stock & Type */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center gap-2">
                    <FiPackage className="text-primary" />
                    Stock Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">
                        Stock Level
                      </p>
                      {selectedItem.stockLevel > 0 ? (
                        <p className="text-lg font-semibold text-green-700">
                          {selectedItem.stockLevel} units available
                        </p>
                      ) : (
                        <p className="text-lg font-semibold text-red-600">
                          Out of Stock
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">
                        Inventory Type
                      </p>
                      <p className="text-lg text-gray-800 font-semibold">
                        {selectedItem.inventoryType || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">
                        Dosage Form
                      </p>
                      <p className="text-lg text-gray-800 font-semibold">
                        {selectedItem.dosage || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center gap-2">
                    <FiTag className="text-primary" />
                    Product Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">
                        Pack Size
                      </p>
                      <p className="text-lg text-gray-800 font-semibold">
                        {selectedItem.packSize || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">
                        Pack Type
                      </p>
                      <p className="text-lg text-gray-800 font-semibold">
                        {selectedItem.packType || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">
                        Manufacturer
                      </p>
                      <p className="text-lg text-gray-800 font-semibold">
                        {selectedItem.manufacturer || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">
                        Country of Origin
                      </p>
                      <p className="text-lg text-gray-800 font-semibold">
                        {selectedItem.country || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">
                        Agent
                      </p>
                      <p className="text-lg text-gray-800 font-semibold">
                        {selectedItem.agent || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Registration Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                    Registration Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">
                        Registration No.
                      </p>
                      <p className="text-lg text-gray-800 font-semibold font-mono">
                        {selectedItem.regNo || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">
                        Registration Date
                      </p>
                      <p className="text-lg text-gray-800 font-semibold">
                        {formatDate(selectedItem.regDate)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">
                        Registration Type
                      </p>
                      <p className="text-lg text-gray-800 font-semibold">
                        {selectedItem.regiType || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">
                        Schedule
                      </p>
                      <p className="text-lg text-gray-800 font-semibold">
                        {selectedItem.schedule || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">
                        Dossier No.
                      </p>
                      <p className="text-lg text-gray-800 font-semibold font-mono">
                        {selectedItem.dossierNo || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="large"
                    className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white min-w-[120px] flex items-center justify-center gap-2"
                    disabled={deletingId === selectedItem._id}
                    onClick={(e) => handleDelete(e, selectedItem)}>
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="large"
                    className="min-w-[120px] flex items-center justify-center gap-2"
                    onClick={(e) => handleEdit(e, selectedItem)}>
                    <FiEdit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="primary"
                    size="large"
                    className="bg-primary hover:bg-primary-dark min-w-[120px]"
                    onClick={() => setSelectedItem(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
