import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import Spinner from "../common/Spinner";
import {
  FaUsers,
  FaUserMd,
  FaFileMedical,
  FaPrescriptionBottle,
  FaChartLine,
  FaCalendarAlt,
  FaUserPlus,
  FaStethoscope,
} from "react-icons/fa";

const Overview = () => {
  const { api } = useAppContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/admin/stats");
        setStats(response.data.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [api]);

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

  const StatCard = ({ title, value, icon, color, change }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <p
              className={`text-sm ${
                change > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {change > 0 ? "+" : ""}
              {change} this month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </div>
  );

  const ChartCard = ({ title, data, type = "bar" }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64 flex items-end justify-between space-x-2">
        {data.length > 0 ? (
          data.map((item, index) => {
            const maxCount = Math.max(...data.map((d) => d.count));
            const height = maxCount > 0 ? (item.count / maxCount) * 200 : 0;
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-blue-500 rounded-t w-full"
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

  return (
    <div className="space-y-6 min-h-screen bg-white p-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.totals.patients}
          icon={<FaUsers className="text-2xl text-white" />}
          color="bg-blue-500"
          change={stats.recent.newPatients}
        />
        <StatCard
          title="Total Doctors"
          value={stats.totals.doctors}
          icon={<FaUserMd className="text-2xl text-white" />}
          color="bg-green-500"
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
                  viewBox="0 0 100 100"
                >
                  {(() => {
                    let cumulativePercentage = 0;
                    const colors = [
                      "#3B82F6",
                      "#10B981",
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
                    "#3B82F6",
                    "#10B981",
                    "#F59E0B",
                    "#EF4444",
                    "#8B5CF6",
                  ];

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
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
