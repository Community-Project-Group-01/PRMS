import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import Spinner from "../common/Spinner";
import {
  FaClock,
  FaStethoscope,
  FaCheckCircle,
  FaUsers,
  FaCalendarCheck,
  FaCalendarAlt,
} from "react-icons/fa";
import { FiRefreshCw, FiActivity } from "react-icons/fi";

const STATUS_COLORS = {
  Queue: "#F59E0B",
  Consultation: "#129990",
  Closed: "#10B981",
};

const TYPE_COLORS = ["#129990", "#096b68", "#F59E0B", "#EF4444", "#8B5CF6", "#0284C7"];

const Overview = () => {
  const { api } = useAppContext();
  const navigate = useNavigate();
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
      <div className="min-h-[450px] flex items-center justify-center p-12">
        <Spinner
          size="large"
          variant="primary"
          showText
          text="Loading Doctor Overview..."
        />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaStethoscope className="text-2xl" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Unable to Load Doctor Statistics</h3>
        <p className="text-gray-500 text-sm mb-4">Please verify your connection and reload.</p>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all cursor-pointer">
          <FiRefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  const { doctor, counts, charts } = stats;

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // SVG Area Line Chart for Daily Series
  const LineChart = ({ data, color = "#129990", labelEvery = 4 }) => {
    const width = 600;
    const height = 220;
    const padding = 24;
    const maxCount = Math.max(1, ...data.map((d) => d.count));
    const stepX = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;

    const points = data.map((d, i) => {
      const x = padding + i * stepX;
      const y = height - padding - (d.count / maxCount) * (height - padding * 2);
      return { x, y, ...d };
    });

    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaPath =
      points.length > 0
        ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${
            height - padding
          } Z`
        : "";

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56" preserveAspectRatio="none">
          <defs>
            <linearGradient id="doctorAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Horizontal Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#E5E7EB" strokeDasharray="3 3" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#E5E7EB" strokeDasharray="3 3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#E5E7EB" />

          {/* Area & Line */}
          <path d={areaPath} fill="url(#doctorAreaGradient)" />
          <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={p.count > 0 ? "3.5" : "2"}
              fill={p.count > 0 ? color : "#9CA3AF"}
              stroke="#FFFFFF"
              strokeWidth="1.5"
              className="hover:r-5 transition-all cursor-pointer">
              <title>
                {p.date}: {p.count} appointments
              </title>
            </circle>
          ))}
          {points.map((p, i) =>
            i % labelEvery === 0 || i === points.length - 1 ? (
              <text
                key={`label-${i}`}
                x={p.x}
                y={height - 6}
                fontSize="10"
                fontWeight="500"
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
      <div className="h-56 flex items-end justify-between gap-2 pt-6 pb-2">
        {data.map((item, index) => {
          const heightPercent = (item.count / maxCount) * 100;
          return (
            <div key={index} className="flex flex-col items-center flex-1 h-full justify-end group">
              <span className="text-[11px] font-bold text-gray-700 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.count}
              </span>
              <div className="w-full bg-slate-200/70 rounded-t-xl overflow-hidden h-36 flex items-end">
                <div
                  className="bg-gradient-to-t from-primary-dark to-primary w-full rounded-t-xl transition-all duration-500 group-hover:from-primary group-hover:to-teal-400 shadow-sm"
                  style={{
                    height: `${Math.max(6, heightPercent)}%`,
                  }}
                />
              </div>
              <span className="text-[10px] font-semibold text-gray-600 mt-2 whitespace-nowrap">
                {item.date.slice(5)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const totalStatus = charts.statusBreakdown.reduce((s, x) => s + x.count, 0);
  const totalPatientTypes = charts.patientTypeBreakdown.reduce((s, x) => s + x.count, 0);

  const DonutLegendCard = ({ title, subtitle, data, total, colorMap, colors }) => (
    <div className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
            {total} Total
          </span>
        </div>

        {data.length > 0 && total > 0 ? (
          <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
            {/* Donut SVG */}
            <div className="relative w-40 h-40 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
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
                        className="hover:opacity-85 transition-opacity cursor-pointer"
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center shadow-inner">
                <div className="text-center">
                  <div className="text-xl font-black text-gray-900">{total}</div>
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total</div>
                </div>
              </div>
            </div>

            {/* Progress Bars Legend */}
            <div className="flex-1 w-full space-y-3">
              {data.map((d, index) => {
                const percentage = ((d.count / total) * 100).toFixed(1);
                const fill = colorMap
                  ? colorMap[d._id] || "#9CA3AF"
                  : colors[index % colors.length];

                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: fill }}></span>
                        <span className="font-semibold text-gray-700 capitalize">{d._id || "Unknown"}</span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {d.count} <span className="font-normal text-gray-400">({percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200/70 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: fill,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-40">
            <p className="text-gray-400 text-sm">No data available</p>
          </div>
        )}
      </div>
      <div className="pt-3 border-t border-gray-200/70 text-xs text-gray-400">
        Live consultation analytics
      </div>
    </div>
  );

  return (
    <div className="p-5 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* Doctor Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary-dark border border-primary/20">
              <FiActivity className="w-3 h-3" />
              Clinical Portal
            </span>
            <span className="text-xs text-gray-400 font-medium">|</span>
            <span className="text-xs text-gray-500 font-medium">{currentDate}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back, Dr. {doctor?.name || ""}
          </h1>
          <p className="text-sm text-gray-500 mt-1 capitalize">
            {doctor?.specialization ? `${doctor.specialization} Specialist • ` : ""}
            Here is the live summary of your active patient consultations today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all disabled:opacity-50 cursor-pointer active:scale-95">
            <FiRefreshCw className={`w-4 h-4 text-primary-dark ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh Portal</span>
          </button>
        </div>
      </div>

      {/* Clinical KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {/* Waiting in Queue */}
        <div
          onClick={() => navigate("/dashboard/doctor/appointments")}
          className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-5 hover:shadow-md hover:border-amber-300/80 hover:-translate-y-0.5 transition-all cursor-pointer group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">In Queue</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">{counts.queue}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-xs text-amber-700 font-medium">Waiting outside</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20 group-hover:scale-105 transition-transform">
              <FaClock className="text-xl" />
            </div>
          </div>
        </div>

        {/* In Consultation */}
        <div
          onClick={() => navigate("/dashboard/doctor/appointments")}
          className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-5 hover:shadow-md hover:border-teal-300/80 hover:-translate-y-0.5 transition-all cursor-pointer group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">In Consultation</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">{counts.consultation}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span className="text-xs text-teal-700 font-medium">Active session</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center border border-teal-500/20 group-hover:scale-105 transition-transform">
              <FaStethoscope className="text-xl" />
            </div>
          </div>
        </div>

        {/* Closed Last 10 Days */}
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-5 hover:shadow-md hover:border-emerald-300/80 hover:-translate-y-0.5 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Completed (10d)</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">{counts.closedLast10Days}</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-2">
                Recently Finished
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
              <FaCheckCircle className="text-xl" />
            </div>
          </div>
        </div>

        {/* Total Patients Seen */}
        <div
          onClick={() => navigate("/dashboard/doctor/patients")}
          className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-5 hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 transition-all cursor-pointer group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Patients Seen</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">{counts.totalPatients}</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-dark bg-primary/10 px-2 py-0.5 rounded-md mt-2">
                Unique Patients
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-dark/10 text-primary-dark flex items-center justify-center border border-primary-dark/20 group-hover:scale-105 transition-transform">
              <FaUsers className="text-xl" />
            </div>
          </div>
        </div>

        {/* Total Appointments */}
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-5 hover:shadow-md hover:border-purple-300 hover:-translate-y-0.5 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Appointments</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">{counts.totalAppointments}</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md mt-2">
                All Time
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center border border-purple-500/20">
              <FaCalendarCheck className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* 30-Day Appointments Trend Area Chart */}
      <div className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Consultations Trend</h3>
            <p className="text-xs text-gray-500">Daily appointment volume handled across the last 30 days</p>
          </div>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-lg self-start sm:self-auto">
            30-Day Activity
          </span>
        </div>
        <LineChart data={charts.last30Days} />
      </div>

      {/* Grid for Bar Chart and Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Closed last 10 days Bar Chart */}
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Completed Sessions</h3>
                <p className="text-xs text-gray-500">Appointments closed in the last 10 days</p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Last 10 Days
              </span>
            </div>
            <BarChart data={charts.closedLast10Days} />
          </div>
          <div className="pt-3 border-t border-gray-200/70 flex items-center justify-between text-xs text-gray-500">
            <span>Total closed in window</span>
            <span className="font-semibold text-gray-700">{counts.closedLast10Days} Consultations</span>
          </div>
        </div>

        {/* Appointment Status Breakdown */}
        <DonutLegendCard
          title="Appointment Status Breakdown"
          subtitle="Distribution of appointment lifecycle states"
          data={charts.statusBreakdown}
          total={totalStatus}
          colorMap={STATUS_COLORS}
        />
      </div>

      {/* Patient Type Distribution */}
      <DonutLegendCard
        title="Patients by Campus Category"
        subtitle="Demographic profile of patients you have treated"
        data={charts.patientTypeBreakdown}
        total={totalPatientTypes}
        colors={TYPE_COLORS}
      />

      {/* Doctor Quick Action Strip */}
      <div className="bg-gradient-to-r from-primary-dark via-[#0d7d76] to-primary rounded-2xl shadow-md p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Clinical Workflow Actions</h3>
            <p className="text-xs text-emerald-100/80 mt-0.5">
              Jump straight to active queue, review patient history, or edit clinical notes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => navigate("/dashboard/doctor/appointments")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-primary-dark text-xs font-bold hover:bg-emerald-50 shadow-sm transition-all cursor-pointer">
              <FaCalendarAlt className="w-3.5 h-3.5 text-primary" />
              Manage Appointments
            </button>
            <button
              onClick={() => navigate("/dashboard/doctor/patients")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/10 transition-all cursor-pointer">
              <FaUsers className="w-3.5 h-3.5 text-emerald-300" />
              Patient Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
