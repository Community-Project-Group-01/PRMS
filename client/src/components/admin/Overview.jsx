import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import Spinner from "../common/Spinner";
import {
  FaUsers,
  FaUserMd,
  FaFileMedical,
  FaPrescriptionBottle,
  FaClock,
  FaStethoscope,
  FaExclamationTriangle,
  FaTimesCircle,
  FaBoxOpen,
  FaUserPlus,
  FaPlusCircle,
} from "react-icons/fa";
import { FiRefreshCw, FiArrowRight, FiActivity, FiCheckCircle } from "react-icons/fi";

const Overview = () => {
  const { api } = useAppContext();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/admin/stats");
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchStats();
      setLoading(false);
    })();
  }, [api]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-[450px] flex items-center justify-center p-12">
        <Spinner
          size="large"
          variant="primary"
          showText
          text="Loading Admin Overview..."
        />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaTimesCircle className="text-2xl" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Unable to Load Statistics</h3>
        <p className="text-gray-500 text-sm mb-4">Please check your connection and try again.</p>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all cursor-pointer">
          <FiRefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  const queue = stats.queue || { inQueue: 0, inConsultation: 0, active: [] };
  const inventoryAlerts = stats.inventoryAlerts || {
    lowStockThreshold: 10,
    lowStockCount: 0,
    outOfStockCount: 0,
    lowStockItems: [],
    outOfStockItems: [],
  };

  const statusConfig = {
    Queue: {
      label: "Waiting",
      icon: <FaClock className="w-3 h-3" />,
      badge: "bg-amber-50 text-amber-700 border border-amber-200/60",
      dot: "bg-amber-500 animate-pulse",
    },
    Consultation: {
      label: "In Consultation",
      icon: <FaStethoscope className="w-3 h-3" />,
      badge: "bg-teal-50 text-teal-700 border border-teal-200/60",
      dot: "bg-teal-500 animate-pulse",
    },
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="p-5 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary-dark border border-primary/20">
              <FiActivity className="w-3 h-3" />
              Live Overview
            </span>
            <span className="text-xs text-gray-400 font-medium">|</span>
            <span className="text-xs text-gray-500 font-medium">{currentDate}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            Hospital Administration Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time monitor of patient flow, clinic queue status, and medical inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all disabled:opacity-50 cursor-pointer active:scale-95">
            <FiRefreshCw className={`w-4 h-4 text-primary-dark ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {(inventoryAlerts.outOfStockCount > 0 || inventoryAlerts.lowStockCount > 0) && (
        <div className="space-y-3">
          {inventoryAlerts.outOfStockCount > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-red-50/90 border border-red-200/80 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-red-100 text-red-600 rounded-xl flex-shrink-0">
                  <FaTimesCircle className="text-xl" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-red-900 text-sm sm:text-base">
                      {inventoryAlerts.outOfStockCount} Inventory Item{inventoryAlerts.outOfStockCount > 1 ? "s" : ""} Out of Stock
                    </p>
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-red-200/80 text-red-800 rounded-md uppercase">
                      Action Required
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-red-700 mt-1">
                    {inventoryAlerts.outOfStockItems
                      .slice(0, 5)
                      .map((i) => i.brandName)
                      .join(", ")}
                    {inventoryAlerts.outOfStockCount > 5 && " and others"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/dashboard/admin/inventory")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-all self-start sm:self-center cursor-pointer">
                Manage Stock <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {inventoryAlerts.lowStockCount > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl flex-shrink-0">
                  <FaExclamationTriangle className="text-xl" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-amber-900 text-sm sm:text-base">
                      {inventoryAlerts.lowStockCount} Item{inventoryAlerts.lowStockCount > 1 ? "s" : ""} Running Low (≤ {inventoryAlerts.lowStockThreshold} units)
                    </p>
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-200/80 text-amber-800 rounded-md uppercase">
                      Warning
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-700 mt-1">
                    {inventoryAlerts.lowStockItems
                      .slice(0, 5)
                      .map((i) => `${i.brandName} (${i.stockLevel})`)
                      .join(", ")}
                    {inventoryAlerts.lowStockCount > 5 && " and more"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/dashboard/admin/inventory")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-amber-900 bg-amber-200 hover:bg-amber-300 rounded-xl shadow-sm transition-all self-start sm:self-center cursor-pointer">
                Check Inventory <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Operational Live Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Waiting */}
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-5 hover:shadow-md hover:border-amber-300/80 hover:-translate-y-0.5 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Patients in Queue</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">{queue.inQueue}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-xs text-amber-700 font-medium">Waiting for doctor</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
              <FaClock className="text-xl" />
            </div>
          </div>
        </div>

        {/* Consultation */}
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-5 hover:shadow-md hover:border-teal-300/80 hover:-translate-y-0.5 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">In Consultation</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">{queue.inConsultation}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span className="text-xs text-teal-700 font-medium">With attending doctor</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center border border-teal-500/20">
              <FaStethoscope className="text-xl" />
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div
          onClick={() => navigate("/dashboard/admin/inventory")}
          className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-5 hover:shadow-md hover:border-amber-300/80 hover:-translate-y-0.5 transition-all cursor-pointer group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Low Stock Medicines</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">{inventoryAlerts.lowStockCount}</p>
              <p className="text-xs text-amber-600 font-medium mt-2 flex items-center gap-1 group-hover:underline">
                Threshold: ≤ {inventoryAlerts.lowStockThreshold} units <FiArrowRight className="w-3 h-3" />
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20 group-hover:scale-105 transition-transform">
              <FaExclamationTriangle className="text-xl" />
            </div>
          </div>
        </div>

        {/* Out of Stock */}
        <div
          onClick={() => navigate("/dashboard/admin/inventory")}
          className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-5 hover:shadow-md hover:border-red-300/80 hover:-translate-y-0.5 transition-all cursor-pointer group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Out of Stock</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">{inventoryAlerts.outOfStockCount}</p>
              <p className="text-xs text-red-600 font-medium mt-2 flex items-center gap-1 group-hover:underline">
                Requires restock <FiArrowRight className="w-3 h-3" />
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center border border-red-500/20 group-hover:scale-105 transition-transform">
              <FaBoxOpen className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* System Totals Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div
          onClick={() => navigate("/dashboard/admin/patients")}
          className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-5 hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 transition-all cursor-pointer group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Patients</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats.totals.patients}</p>
              {stats.recent?.newPatients !== undefined && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-2">
                  +{stats.recent.newPatients} this month
                </span>
              )}
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary-dark flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
              <FaUsers className="text-xl" />
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate("/dashboard/admin/doctors")}
          className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-5 hover:shadow-md hover:border-teal-400 hover:-translate-y-0.5 transition-all cursor-pointer group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Registered Doctors</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats.totals.doctors}</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md mt-2">
                Active Staff
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-dark/10 text-primary-dark flex items-center justify-center border border-primary-dark/20 group-hover:scale-105 transition-transform">
              <FaUserMd className="text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-5 hover:shadow-md hover:border-purple-300 hover:-translate-y-0.5 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Medical Records</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats.totals.medicalRecords}</p>
              {stats.recent?.newMedicalRecords !== undefined && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md mt-2">
                  +{stats.recent.newMedicalRecords} this month
                </span>
              )}
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center border border-purple-500/20">
              <FaFileMedical className="text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-5 hover:shadow-md hover:border-orange-300 hover:-translate-y-0.5 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Prescriptions Issued</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats.totals.prescriptions}</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md mt-2">
                Total Dispensed
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center border border-orange-500/20">
              <FaPrescriptionBottle className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Live Queue Monitor Table */}
      <div className="bg-slate-50/70 rounded-2xl border border-slate-200/70 overflow-hidden">
        <div className="p-5 border-b border-gray-200/70 bg-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">Live Consultation Queue</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary-dark">
                {queue.active.length} Active
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Real-time patient check-ins and appointments currently in progress.
            </p>
          </div>
          <span className="text-xs text-gray-400 font-medium">
            Auto-synced with Clinic Desk
          </span>
        </div>

        {queue.active.length > 0 ? (
          <div className="overflow-x-auto bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-gray-600 font-semibold text-xs uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3.5">Patient Details</th>
                  <th className="px-5 py-3.5">Assigned Doctor</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Checked In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {queue.active.map((appt) => {
                  const config = statusConfig[appt.status] || statusConfig.Queue;
                  const patientName = appt.patient?.user?.name || "Unknown Patient";
                  const initial = patientName.charAt(0).toUpperCase();

                  return (
                    <tr key={appt._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary-dark font-bold text-xs flex items-center justify-center border border-primary/20">
                            {initial}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{patientName}</p>
                            {appt.patient?.patientType && (
                              <span className="inline-block text-[11px] font-medium text-gray-500 capitalize bg-gray-100 px-1.5 py-0.5 rounded mt-0.5">
                                {appt.patient.patientType}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-800">
                          Dr. {appt.doctor?.user?.name || "Unassigned"}
                        </p>
                        {appt.doctor?.specialization && (
                          <p className="text-xs text-gray-500">{appt.doctor.specialization}</p>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.badge}`}>
                          <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
                          {config.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-xs font-medium text-gray-500">
                        {new Date(appt.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 px-4 text-center bg-white">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-100">
              <FiCheckCircle className="text-2xl" />
            </div>
            <h4 className="text-base font-bold text-gray-800">Queue is Clear</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
              There are no patients currently waiting in queue or inside consultation rooms.
            </p>
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Records Chart */}
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Medical Records Created</h3>
                <p className="text-xs text-gray-500">Monthly breakdown over the last 6 months</p>
              </div>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                Last 6 Months
              </span>
            </div>

            <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2">
              {stats.charts.monthlyRecords && stats.charts.monthlyRecords.length > 0 ? (
                stats.charts.monthlyRecords.map((item, index) => {
                  const maxCount = Math.max(1, ...stats.charts.monthlyRecords.map((d) => d.count));
                  const heightPercent = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

                  return (
                    <div key={index} className="flex flex-col items-center flex-1 h-full justify-end group">
                      <span className="text-xs font-bold text-gray-700 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.count}
                      </span>
                      <div className="w-full bg-slate-200/70 rounded-t-xl overflow-hidden h-44 flex items-end">
                        <div
                          className="bg-gradient-to-t from-primary-dark to-primary w-full rounded-t-xl transition-all duration-500 group-hover:from-primary group-hover:to-teal-400 shadow-sm"
                          style={{ height: `${Math.max(8, heightPercent)}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-600 mt-2 whitespace-nowrap">
                        {item._id.month}/{String(item._id.year).slice(2)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-full w-full">
                  <p className="text-gray-400 text-sm">No monthly records data available</p>
                </div>
              )}
            </div>
          </div>
          <div className="pt-3 border-t border-gray-200/70 flex items-center justify-between text-xs text-gray-500">
            <span>Aggregated record creation</span>
            <span className="font-semibold text-gray-700">Total: {stats.totals.medicalRecords}</span>
          </div>
        </div>

        {/* Patient Type Distribution Chart */}
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Patient Type Distribution</h3>
                <p className="text-xs text-gray-500">Campus demographic category breakdown</p>
              </div>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                {stats.totals.patients} Total
              </span>
            </div>

            {stats.distributions.patientTypes && stats.distributions.patientTypes.length > 0 ? (
              <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
                {/* Donut Chart SVG */}
                <div className="relative w-44 h-44 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {(() => {
                      let cumulativePercentage = 0;
                      const colors = ["#129990", "#096b68", "#F59E0B", "#EF4444", "#8B5CF6", "#0284C7"];

                      return stats.distributions.patientTypes.map((type, index) => {
                        const total = stats.totals.patients || 1;
                        const percentage = (type.count / total) * 100;
                        const startAngle = (cumulativePercentage / 100) * 360;
                        const endAngle = ((cumulativePercentage + percentage) / 100) * 360;

                        const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                        const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                        const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                        const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

                        const largeArcFlag = percentage > 50 ? 1 : 0;
                        const pathData = [
                          `M 50 50`,
                          `L ${x1} ${y1}`,
                          `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                          `Z`,
                        ].join(" ");

                        cumulativePercentage += percentage;

                        return (
                          <path
                            key={index}
                            d={pathData}
                            fill={colors[index % colors.length]}
                            className="hover:opacity-85 transition-opacity cursor-pointer"
                          />
                        );
                      });
                    })()}
                  </svg>

                  {/* Center cutout */}
                  <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center shadow-inner">
                    <div className="text-center">
                      <div className="text-2xl font-black text-gray-900">{stats.totals.patients}</div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Patients</div>
                    </div>
                  </div>
                </div>

                {/* Breakdown Progress Bars */}
                <div className="flex-1 w-full space-y-3">
                  {stats.distributions.patientTypes.map((type, index) => {
                    const total = stats.totals.patients || 1;
                    const percentage = ((type.count / total) * 100).toFixed(1);
                    const colors = ["#129990", "#096b68", "#F59E0B", "#EF4444", "#8B5CF6", "#0284C7"];
                    const currentColor = colors[index % colors.length];

                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: currentColor }}></span>
                            <span className="font-semibold text-gray-700 capitalize">{type._id || "Other"}</span>
                          </div>
                          <span className="font-bold text-gray-900">
                            {type.count} <span className="font-normal text-gray-400">({percentage}%)</span>
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200/70 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: currentColor,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-44">
                <p className="text-gray-400 text-sm">No patient distribution data available</p>
              </div>
            )}
          </div>
          <div className="pt-3 border-t border-gray-200/70 text-xs text-gray-500">
            Categorized by official university community affiliations.
          </div>
        </div>
      </div>

      {/* Quick Administrative Actions Bar */}
      <div className="bg-gradient-to-r from-primary-dark via-[#0d7d76] to-primary rounded-2xl shadow-md p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Quick Administrative Shortcuts</h3>
            <p className="text-xs text-emerald-100/80 mt-0.5">
              Instantly create records, register staff, or update pharmacy inventory levels.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => navigate("/dashboard/admin/add-doctor")}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/10 transition-all cursor-pointer">
              <FaUserMd className="w-3.5 h-3.5 text-emerald-300" />
              Add Doctor
            </button>
            <button
              onClick={() => navigate("/dashboard/admin/add-patient")}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/10 transition-all cursor-pointer">
              <FaUserPlus className="w-3.5 h-3.5 text-emerald-300" />
              Add Patient
            </button>
            <button
              onClick={() => navigate("/dashboard/admin/add-inventory")}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/10 transition-all cursor-pointer">
              <FaPlusCircle className="w-3.5 h-3.5 text-emerald-300" />
              Add Stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
