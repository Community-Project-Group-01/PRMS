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
} from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner
          size="large"
          variant="primary"
          showText
          text="Loading Overview..."
        />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load statistics</p>
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

  const StatCard = ({ title, value, icon, color, change, onClick }) => (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow ${
        onClick ? "cursor-pointer" : ""
      }`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <p
              className={`text-sm ${
                change > 0 ? "text-green-600" : "text-gray-500"
              }`}>
              {change > 0 ? "+" : ""}
              {change} this month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </div>
  );

  const ChartCard = ({ title, data }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64 flex items-end justify-between space-x-2">
        {data.length > 0 ? (
          data.map((item, index) => {
            const maxCount = Math.max(...data.map((d) => d.count));
            const height = maxCount > 0 ? (item.count / maxCount) * 200 : 0;
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <span className="text-xs text-gray-500 mb-1">
                  {item.count}
                </span>
                <div
                  className="bg-primary rounded-t w-full"
                  style={{ height: `${height}px` }}
                />
                <span className="text-xs text-gray-600 mt-2">
                  {item._id.month}/{item._id.year}
                </span>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>
    </div>
  );

  const statusConfig = {
    Queue: {
      label: "Waiting",
      icon: <FaClock className="w-3.5 h-3.5" />,
      badge: "bg-yellow-100 text-yellow-800",
      dot: "bg-yellow-500",
    },
    Consultation: {
      label: "In Consultation",
      icon: <FaStethoscope className="w-3.5 h-3.5" />,
      badge: "bg-blue-100 text-blue-800",
      dot: "bg-blue-500",
    },
  };

  return (
    <div className="space-y-6 min-h-screen bg-gray-50/50 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Live snapshot of patients, queue activity, and inventory health.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 self-start sm:self-auto">
          <FiRefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Critical Alerts */}
      {(inventoryAlerts.outOfStockCount > 0 || inventoryAlerts.lowStockCount > 0) && (
        <div className="space-y-3">
          {inventoryAlerts.outOfStockCount > 0 && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <FaTimesCircle className="text-red-600 text-xl mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-red-800">
                  {inventoryAlerts.outOfStockCount} item
                  {inventoryAlerts.outOfStockCount > 1 ? "s" : ""} out of stock
                </p>
                <p className="text-sm text-red-700 mt-1">
                  {inventoryAlerts.outOfStockItems
                    .slice(0, 5)
                    .map((i) => i.brandName)
                    .join(", ")}
                  {inventoryAlerts.outOfStockCount > 5 && ", ..."}
                </p>
              </div>
              <button
                onClick={() => navigate("/dashboard/admin/inventory")}
                className="text-sm font-semibold text-red-700 hover:text-red-900 whitespace-nowrap">
                View Inventory
              </button>
            </div>
          )}
          {inventoryAlerts.lowStockCount > 0 && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <FaExclamationTriangle className="text-amber-600 text-xl mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-amber-800">
                  {inventoryAlerts.lowStockCount} item
                  {inventoryAlerts.lowStockCount > 1 ? "s" : ""} running low on
                  stock (≤ {inventoryAlerts.lowStockThreshold} units)
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  {inventoryAlerts.lowStockItems
                    .slice(0, 5)
                    .map((i) => `${i.brandName} (${i.stockLevel})`)
                    .join(", ")}
                  {inventoryAlerts.lowStockCount > 5 && ", ..."}
                </p>
              </div>
              <button
                onClick={() => navigate("/dashboard/admin/inventory")}
                className="text-sm font-semibold text-amber-700 hover:text-amber-900 whitespace-nowrap">
                View Inventory
              </button>
            </div>
          )}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Patients in Queue"
          value={queue.inQueue}
          icon={<FaClock className="text-2xl text-white" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="In Consultation"
          value={queue.inConsultation}
          icon={<FaStethoscope className="text-2xl text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Low Stock Items"
          value={inventoryAlerts.lowStockCount}
          icon={<FaExclamationTriangle className="text-2xl text-white" />}
          color="bg-amber-500"
          onClick={() => navigate("/dashboard/admin/inventory")}
        />
        <StatCard
          title="Out of Stock"
          value={inventoryAlerts.outOfStockCount}
          icon={<FaBoxOpen className="text-2xl text-white" />}
          color="bg-red-500"
          onClick={() => navigate("/dashboard/admin/inventory")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Patients"
          value={stats.totals.patients}
          icon={<FaUsers className="text-2xl text-white" />}
          color="bg-primary"
          change={stats.recent.newPatients}
        />
        <StatCard
          title="Total Doctors"
          value={stats.totals.doctors}
          icon={<FaUserMd className="text-2xl text-white" />}
          color="bg-primary-dark"
        />
        <StatCard
          title="Medical Records"
          value={stats.totals.medicalRecords}
          icon={<FaFileMedical className="text-2xl text-white" />}
          color="bg-purple-500"
          change={stats.recent.newMedicalRecords}
        />
        <StatCard
          title="Prescriptions"
          value={stats.totals.prescriptions}
          icon={<FaPrescriptionBottle className="text-2xl text-white" />}
          color="bg-orange-500"
        />
      </div>

      {/* Live Queue */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Live Queue</h3>
          <span className="text-xs text-gray-500">
            Showing up to 10 active appointments
          </span>
        </div>
        {queue.active.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                    Patient
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                    Doctor
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                    Since
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {queue.active.map((appt) => {
                  const config = statusConfig[appt.status] || statusConfig.Queue;
                  return (
                    <tr key={appt._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-800">
                          {appt.patient?.user?.name || "Unknown Patient"}
                        </span>
                        {appt.patient?.patientType && (
                          <span className="text-xs text-gray-500 block capitalize">
                            {appt.patient.patientType}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Dr. {appt.doctor?.user?.name || "Unassigned"}
                        {appt.doctor?.specialization && (
                          <span className="text-xs text-gray-500 block">
                            {appt.doctor.specialization}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.badge}`}>
                          {config.icon}
                          {config.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
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
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <FaStethoscope className="text-3xl text-gray-300 mb-2" />
            <p className="text-gray-500">No patients currently in queue or consultation</p>
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Records Chart */}
        <ChartCard
          title="Medical Records (Last 6 Months)"
          data={stats.charts.monthlyRecords}
        />

        {/* Patient Type Distribution - Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Patient Types Distribution
          </h3>
          {stats.distributions.patientTypes.length > 0 ? (
            <div className="flex flex-col lg:flex-row items-center gap-6">
              {/* Pie Chart */}
              <div className="relative w-48 h-48 flex-shrink-0">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100">
                  {(() => {
                    let cumulativePercentage = 0;
                    const colors = [
                      "#129990",
                      "#096b68",
                      "#F59E0B",
                      "#EF4444",
                      "#8B5CF6",
                    ];

                    return stats.distributions.patientTypes.map(
                      (type, index) => {
                        const percentage =
                          (type.count / stats.totals.patients) * 100;
                        const startAngle = (cumulativePercentage / 100) * 360;
                        const endAngle =
                          ((cumulativePercentage + percentage) / 100) * 360;

                        const x1 =
                          50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                        const y1 =
                          50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                        const x2 =
                          50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                        const y2 =
                          50 + 40 * Math.sin((endAngle * Math.PI) / 180);

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
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        );
                      }
                    );
                  })()}
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.totals.patients}
                    </div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 space-y-3">
                {stats.distributions.patientTypes.map((type, index) => {
                  const percentage = (
                    (type.count / stats.totals.patients) *
                    100
                  ).toFixed(1);
                  const colors = [
                    "#129990",
                    "#096b68",
                    "#F59E0B",
                    "#EF4444",
                    "#8B5CF6",
                  ];

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: colors[index % colors.length],
                          }}
                        />
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {type._id}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-900">
                          {type.count}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({percentage}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-500">No patient data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
