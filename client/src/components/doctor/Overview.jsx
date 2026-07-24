import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import Spinner from "../common/Spinner";
import {
  FaClock,
  FaStethoscope,
  FaCheckCircle,
  FaUsers,
  FaCalendarCheck,
} from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

const STATUS_COLORS = {
  Queue: "#F59E0B",
  Consultation: "#129990",
  Closed: "#10B981",
};

const TYPE_COLORS = ["#129990", "#096b68", "#F59E0B", "#EF4444", "#8B5CF6"];

const Overview = () => {
  const { api } = useAppContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/doctor/stats");
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching doctor stats:", error);
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

  const { doctor, counts, charts } = stats;

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </div>
  );

  // Simple SVG line/area chart for daily series [{date, count}]
  const LineChart = ({ data, color = "#129990", labelEvery = 5 }) => {
    const width = 600;
    const height = 220;
    const padding = 24;
    const maxCount = Math.max(1, ...data.map((d) => d.count));
    const stepX =
      data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;

    const points = data.map((d, i) => {
      const x = padding + i * stepX;
      const y =
        height - padding - (d.count / maxCount) * (height - padding * 2);
      return { x, y, ...d };
    });

    const linePath = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");
    const areaPath =
      points.length > 0
        ? `${linePath} L ${points[points.length - 1].x} ${
            height - padding
          } L ${points[0].x} ${height - padding} Z`
        : "";

    return (
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56"
          preserveAspectRatio="none">
          <path d={areaPath} fill={color} fillOpacity="0.1" />
          <path d={linePath} fill="none" stroke={color} strokeWidth="2" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={color}>
              <title>
                {p.date}: {p.count}
              </title>
            </circle>
          ))}
          {points.map((p, i) =>
            i % labelEvery === 0 || i === points.length - 1 ? (
              <text
                key={`label-${i}`}
                x={p.x}
                y={height - 4}
                fontSize="9"
                textAnchor="middle"
                fill="#6B7280">
                {p.date.slice(5)}
              </text>
            ) : null
          )}
        </svg>
      </div>
    );
  };

  const BarChart = ({ data }) => {
    const maxCount = Math.max(1, ...data.map((d) => d.count));
    return (
      <div className="h-56 flex items-end justify-between gap-1">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <span className="text-xs text-gray-500 mb-1">{item.count}</span>
            <div
              className="bg-primary rounded-t w-full"
              style={{
                height: `${(item.count / maxCount) * 170}px`,
                minHeight: item.count > 0 ? "4px" : "0",
              }}
            />
            <span className="text-[10px] text-gray-600 mt-2 whitespace-nowrap">
              {item.date.slice(5)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const totalStatus = charts.statusBreakdown.reduce((s, x) => s + x.count, 0);
  const totalPatientTypes = charts.patientTypeBreakdown.reduce(
    (s, x) => s + x.count,
    0
  );

  const DonutLegendCard = ({ title, data, total, colorMap, colors }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {data.length > 0 && total > 0 ? (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-40 h-40 flex-shrink-0">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100">
              {(() => {
                let cumulative = 0;
                return data.map((d, index) => {
                  const percentage = (d.count / total) * 100;
                  const startAngle = (cumulative / 100) * 360;
                  const endAngle = ((cumulative + percentage) / 100) * 360;
                  const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                  const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                  const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
                  const largeArc = percentage > 50 ? 1 : 0;
                  const path = [
                    "M 50 50",
                    `L ${x1} ${y1}`,
                    `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
                    "Z",
                  ].join(" ");
                  cumulative += percentage;
                  const fill = colorMap
                    ? colorMap[d._id] || "#9CA3AF"
                    : colors[index % colors.length];
                  return (
                    <path
                      key={index}
                      d={path}
                      fill={fill}
                      className="hover:opacity-80 transition-opacity"
                    />
                  );
                });
              })()}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{total}</div>
                <div className="text-[10px] text-gray-600">Total</div>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full space-y-2">
            {data.map((d, index) => {
              const percentage = ((d.count / total) * 100).toFixed(1);
              const fill = colorMap
                ? colorMap[d._id] || "#9CA3AF"
                : colors[index % colors.length];
              return (
                <div
                  key={index}
                  className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: fill }}
                    />
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {d._id || "Unknown"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {d.count}
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
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-500">No data available</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 min-h-screen bg-gray-50/50 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, Dr. {doctor?.name || ""}
          </h1>
          <p className="text-sm text-gray-500 mt-1 capitalize">
            {doctor?.specialization
              ? `${doctor.specialization} — `
              : ""}
            Here's what's happening with your patients today.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 self-start sm:self-auto">
          <FiRefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          title="Patients in Queue"
          value={counts.queue}
          icon={<FaClock className="text-2xl text-white" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="In Consultation"
          value={counts.consultation}
          icon={<FaStethoscope className="text-2xl text-white" />}
          color="bg-primary"
        />
        <StatCard
          title="Closed (Last 10 Days)"
          value={counts.closedLast10Days}
          icon={<FaCheckCircle className="text-2xl text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Total Patients Seen"
          value={counts.totalPatients}
          icon={<FaUsers className="text-2xl text-white" />}
          color="bg-primary-dark"
        />
        <StatCard
          title="Total Appointments"
          value={counts.totalAppointments}
          icon={<FaCalendarCheck className="text-2xl text-white" />}
          color="bg-purple-500"
        />
      </div>

      {/* 30-day appointments trend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Appointments (Last 30 Days)
        </h3>
        <LineChart data={charts.last30Days} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Closed last 10 days */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Closed Appointments (Last 10 Days)
          </h3>
          <BarChart data={charts.closedLast10Days} />
        </div>

        {/* Status breakdown */}
        <DonutLegendCard
          title="Appointment Status Breakdown"
          data={charts.statusBreakdown}
          total={totalStatus}
          colorMap={STATUS_COLORS}
        />
      </div>

      {/* Patient type breakdown */}
      <DonutLegendCard
        title="Your Patients by Type"
        data={charts.patientTypeBreakdown}
        total={totalPatientTypes}
        colors={TYPE_COLORS}
      />
    </div>
  );
};

export default Overview;
