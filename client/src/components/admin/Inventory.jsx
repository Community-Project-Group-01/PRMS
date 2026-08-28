import React, { useState, useEffect, useMemo } from "react";
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
  FiFilter,
  FiLayers,
  FiCheckCircle,
  FiAlertCircle,
  FiRotateCcw,
} from "react-icons/fi";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import api from "../../api/client";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Pagination from "../common/Pagination";

const INVENTORY_TYPES = [
  "Medicine",
  "Material",
  "Medical Device",
  "Consumable",
  "Equipment",
  "Diagnostic",
  "Other",
];

const STOCK_STATUSES = [
  { value: "all", label: "All Stock Levels" },
  { value: "in_stock", label: "In Stock (> 10)" },
  { value: "low_stock", label: "Low Stock (≤ 10)" },
  { value: "out_of_stock", label: "Out of Stock (0)" },
];

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 0, total: 0 });
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const fetchInventory = async (customPage = page) => {
    try {
      setLoading(true);
      setRefreshing(true);
      setError(null);

      const params = {
        page: customPage,
        limit: 10,
      };

      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (typeFilter !== "all") params.type = typeFilter;
      if (stockFilter !== "all") params.stock = stockFilter;

      const response = await api.get("/api/inventory", { params });
      const data = response.data;

      const inventoryData = data.data || data || [];
      setItems(inventoryData);
      setPagination(
        data.meta || {
          page: customPage,
          pages: 0,
          total: inventoryData.length,
        },
      );
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

  // Trigger search / filters
  useEffect(() => {
    fetchInventory(page);
  }, [page, typeFilter, stockFilter]);

  // Handle search term input with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      if (page === 1) {
        fetchInventory(1);
      } else {
        setPage(1);
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setStockFilter("all");
    setPage(1);
  };

  const hasActiveFilters =
    searchTerm.trim() !== "" || typeFilter !== "all" || stockFilter !== "all";

  // Helper for type color styles
  const getTypeBadgeStyle = (type) => {
    const normalized = (type || "").toLowerCase();
    if (normalized === "medicine" || normalized === "drug") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    if (normalized === "material") {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }
    if (normalized === "medical device") {
      return "bg-amber-50 text-amber-800 border-amber-200";
    }
    if (normalized === "consumable") {
      return "bg-teal-50 text-teal-700 border-teal-200";
    }
    if (normalized === "equipment") {
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
    if (normalized === "diagnostic") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  // Helper for stock level badge
  const renderStockBadge = (stock) => {
    const num = Number(stock) || 0;
    if (num <= 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200 whitespace-nowrap">
          <FiAlertTriangle className="w-3.5 h-3.5 text-red-600" />
          Out of Stock
        </span>
      );
    }
    if (num <= 10) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 whitespace-nowrap">
          <FiAlertCircle className="w-3.5 h-3.5 text-amber-600" />
          Low: {num} left
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200 whitespace-nowrap">
        <FiCheckCircle className="w-3.5 h-3.5 text-green-600" />
        {num} in stock
      </span>
    );
  };

  const handleViewDetails = (item) => setSelectedItem(item);

  const handleRefresh = () => fetchInventory(page);

  const handleAddInventory = () => navigate("/dashboard/admin/add-inventory");

  const handleEdit = (e, item) => {
    e.stopPropagation();
    navigate(`/dashboard/admin/edit-inventory/${item._id}`);
  };

  const handleDelete = async (e, item) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      `Delete "${item.brandName}" from inventory? This action cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      setDeletingId(item._id);
      await api.delete(`/api/inventory/${item._id}`);
      toast.success("Inventory item deleted successfully");
      if (selectedItem?._id === item._id) {
        setSelectedItem(null);
      }
      fetchInventory(page);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete inventory item";
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  // Summary counts
  const outOfStockCount = useMemo(
    () => items.filter((item) => (Number(item.stockLevel) || 0) <= 0).length,
    [items],
  );
  const lowStockCount = useMemo(
    () =>
      items.filter(
        (item) =>
          (Number(item.stockLevel) || 0) > 0 &&
          (Number(item.stockLevel) || 0) <= 10,
      ).length,
    [items],
  );
  const medicinesCount = useMemo(
    () =>
      items.filter(
        (item) =>
          (item.inventoryType || "").toLowerCase() === "medicine" ||
          (item.inventoryType || "").toLowerCase() === "drug",
      ).length,
    [items],
  );
  const materialsCount = useMemo(
    () =>
      items.filter(
        (item) => (item.inventoryType || "").toLowerCase() === "material",
      ).length,
    [items],
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-auto mx-auto space-y-6">
        {/* Header & Main Control Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FiPackage className="text-primary" />
                Inventory Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Track pharmaceutical medicines, medical materials, consumables,
                and stock levels.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Button
                variant="outline"
                size="medium"
                onClick={handleRefresh}
                loading={refreshing}
                className="min-w-[120px] flex items-center justify-center border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              >
                {!refreshing && <FiRefreshCw className="w-4 h-4 mr-2" />}
                Refresh
              </Button>
              <Button
                variant="primary"
                size="medium"
                onClick={handleAddInventory}
                className="min-w-[140px] flex items-center justify-center bg-primary hover:bg-primary-dark shadow-sm"
              >
                <FiPlusCircle className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by generic/brand name, manufacturer, agent, reg no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Type / Classification Filter */}
            <div className="relative min-w-[180px]">
              <div className="relative flex items-center">
                <FiLayers className="absolute left-3 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white cursor-pointer appearance-none"
                >
                  <option value="all">All Classifications</option>
                  {INVENTORY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 flex items-center text-gray-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Stock Level Filter */}
            <div className="relative min-w-[180px]">
              <div className="relative flex items-center">
                <FiFilter className="absolute left-3 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={stockFilter}
                  onChange={(e) => {
                    setStockFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white cursor-pointer appearance-none"
                >
                  {STOCK_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 flex items-center text-gray-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Reset Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200 whitespace-nowrap"
              >
                <FiRotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
              <div>
                <p className="font-semibold">Unable to load inventory</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats Cards */}
        {!error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Total Records
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {pagination.total || items.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Across all classifications
                  </p>
                </div>
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FiPackage className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Medicines & Materials
                  </p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {medicinesCount}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      med /
                    </span>{" "}
                    {materialsCount}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      mat
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Primary categories in view
                  </p>
                </div>
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FiTag className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Low Stock (≤ 10)
                  </p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">
                    {lowStockCount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Requires replenishment
                  </p>
                </div>
                <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center">
                  <FiAlertCircle className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Out of Stock
                  </p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {outOfStockCount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Zero units available
                  </p>
                </div>
                <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center">
                  <FiAlertTriangle className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Table Container */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {loading ? (
            <div className="py-20 flex items-center justify-center">
              <Spinner
                size="large"
                variant="primary"
                showText
                text="Loading inventory records..."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <th className="px-6 py-4">Brand / Generic Name</th>
                    <th className="px-6 py-4">Classification</th>
                    <th className="px-6 py-4">Dosage / Form</th>
                    <th className="px-6 py-4">Manufacturer</th>
                    <th className="px-6 py-4">Stock Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <FiSearch className="w-14 h-14 text-gray-300 mb-3" />
                          <p className="text-lg font-semibold text-gray-600 mb-1">
                            No inventory items found
                          </p>
                          <p className="text-sm text-gray-400 max-w-md">
                            {hasActiveFilters
                              ? "No items match your active search or filters. Try adjusting your criteria or clearing filters."
                              : "No inventory items are currently recorded in the system."}
                          </p>
                          {hasActiveFilters && (
                            <button
                              onClick={handleResetFilters}
                              className="mt-4 px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                            >
                              Clear all filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => {
                      const displayType =
                        item.inventoryType === "Drug"
                          ? "Medicine"
                          : item.inventoryType || "Medicine";
                      return (
                        <tr
                          key={item._id}
                          className="hover:bg-primary/5 transition-colors cursor-pointer group"
                          onClick={() => handleViewDetails(item)}
                        >
                          {/* Name & Generic */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3.5">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0">
                                {item.brandName?.charAt(0).toUpperCase() || "I"}
                              </div>
                              <div className="min-w-0">
                                <span className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors block truncate">
                                  {item.brandName || "Unnamed Item"}
                                </span>
                                {item.genericName && (
                                  <span className="text-xs text-gray-500 block truncate mt-0.5">
                                    {item.genericName}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Classification */}
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getTypeBadgeStyle(
                                displayType,
                              )}`}
                            >
                              {displayType}
                            </span>
                          </td>

                          {/* Dosage / Specification */}
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-700">
                              {item.dosage || "—"}
                            </span>
                          </td>

                          {/* Manufacturer */}
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-700">
                              {item.manufacturer || "—"}
                            </div>
                            {item.country && (
                              <div className="text-xs text-gray-400">
                                {item.country}
                              </div>
                            )}
                          </td>

                          {/* Stock Level Badge */}
                          <td className="px-6 py-4">
                            {renderStockBadge(item.stockLevel)}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={(e) => handleEdit(e, item)}
                                title="Edit item"
                                className="p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/10 transition-colors"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleDelete(e, item)}
                                disabled={deletingId === item._id}
                                title="Delete item"
                                className="p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer */}
          {!loading && items.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-xs text-gray-600">
                  Showing{" "}
                  <span className="font-semibold text-gray-800">
                    {items.length}
                  </span>{" "}
                  items (Page {pagination.page} of {pagination.pages || 1})
                </p>
                <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-2xs">
                  Click on any row to view full details
                </span>
              </div>
            </div>
          )}
          <Pagination {...pagination} page={page} onPageChange={setPage} />
        </div>

        {/* Item Details Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-2xl">
                      {selectedItem.brandName?.charAt(0).toUpperCase() || "I"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">
                          {selectedItem.brandName}
                        </h2>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            selectedItem.inventoryType === "Material"
                              ? "bg-purple-100 text-purple-900"
                              : "bg-white/20 text-white"
                          }`}
                        >
                          {selectedItem.inventoryType === "Drug"
                            ? "Medicine"
                            : selectedItem.inventoryType || "Medicine"}
                        </span>
                      </div>
                      <p className="text-white/90 text-sm mt-0.5">
                        {selectedItem.genericName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-white hover:text-white/80 p-2 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center w-10 h-10"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-6">
                {/* Stock & Classification */}
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <FiPackage className="text-primary" />
                    Classification & Stock Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Classification
                      </p>
                      <p className="text-base font-semibold text-gray-800">
                        {selectedItem.inventoryType === "Drug"
                          ? "Medicine"
                          : selectedItem.inventoryType || "Medicine"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Stock Level
                      </p>
                      <div>{renderStockBadge(selectedItem.stockLevel)}</div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Dosage / Form
                      </p>
                      <p className="text-base font-semibold text-gray-800">
                        {selectedItem.dosage || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Packaging & Supplier Details */}
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <FiTag className="text-primary" />
                    Packaging & Manufacturer
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Pack Size
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {selectedItem.packSize || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Pack Type
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {selectedItem.packType || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Manufacturer
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {selectedItem.manufacturer || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Country of Origin
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {selectedItem.country || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">Agent</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {selectedItem.agent || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Schedule
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {selectedItem.schedule || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Registration Details */}
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                    Registration Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Registration No.
                      </p>
                      <p className="text-sm font-semibold text-gray-800 font-mono">
                        {selectedItem.regNo || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Registration Date
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {formatDate(selectedItem.regDate)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Registration Type
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {selectedItem.regiType || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Dossier No.
                      </p>
                      <p className="text-sm font-semibold text-gray-800 font-mono">
                        {selectedItem.dossierNo || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="medium"
                    className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white flex items-center justify-center gap-2"
                    disabled={deletingId === selectedItem._id}
                    onClick={(e) => handleDelete(e, selectedItem)}
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="medium"
                    className="flex items-center justify-center gap-2"
                    onClick={(e) => handleEdit(e, selectedItem)}
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="primary"
                    size="medium"
                    className="bg-primary hover:bg-primary-dark"
                    onClick={() => setSelectedItem(null)}
                  >
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
