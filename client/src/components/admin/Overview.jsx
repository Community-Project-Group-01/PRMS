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
    return <Spinner />;
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
    <div className="space-y-6">
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

        {/* Patient Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Patient Types
          </h3>
          <div className="space-y-3">
            {stats.distributions.patientTypes.length > 0 ? (
              stats.distributions.patientTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {type._id}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (type.count / stats.totals.patients) * 100
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">
                      {type.count}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No patient data available
              </p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Overview;
