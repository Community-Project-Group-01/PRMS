import React, { useEffect, useState } from "react";
import {
  FaClock,
  FaStethoscope,
  FaCheckCircle,
  FaUser,
  FaCalendar,
  FaPhone,
  FaMapMarkerAlt,
  FaAllergies,
} from "react-icons/fa";
import { LuRefreshCcw } from "react-icons/lu";
import api from "../../api/client";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState("Queue");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(
        `/api/appointment/getMyAppointments?status=${status}`
      );
      const data = res.data;

      if (data.success) {
        setAppointments(data.data || []);
      } else {
        setError(data.message || "Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError(error.response?.data?.message || "Error fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  const changeState = async (newStatus, id) => {
    try {
      const res = await api.put("/api/appointment/update", {
        status: newStatus,
        id,
      });
      const data = res.data;

      if (data.success) {
        toast.success(data.message || "Appointment updated successfully");
        fetchAppointments();
      } else {
        toast.error(data.message || "Failed to update appointment");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error(error.response?.data?.message || "Server error");
    }
  };

  const handleRefresh = async () => {
    await fetchAppointments();
  };

  const handleStatus = (state) => setStatus(state);

  useEffect(() => {
    fetchAppointments();
  }, [status]);

  const statusConfig = {
    Queue: {
      icon: FaClock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 border-yellow-200",
      badgeColor: "bg-yellow-100 text-yellow-800",
    },
    Consultation: {
      icon: FaStethoscope,
      color: "text-blue-500",
      bgColor: "bg-blue-50 border-blue-200",
      badgeColor: "bg-blue-100 text-blue-800",
    },
    Closed: {
      icon: FaCheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50 border-green-200",
      badgeColor: "bg-green-100 text-green-800",
    },
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-auto mx-auto">
        {/* Status Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Filter by Status
          </h2>
          <div className="flex flex-wrap gap-3">
            {["Queue", "Consultation", "Closed"].map((sts, idx) => {
              const isActive = status === sts;
              const config = statusConfig[sts];
              const Icon = config.icon;
              return (
                <Button
                  key={idx}
                  variant={isActive ? "primary" : "outline"}
                  size="medium"
                  onClick={() => handleStatus(sts)}
                  className={`flex items-center gap-2 ${
                    isActive ? "shadow-md" : "hover:shadow-sm"
                  } transition-all`}>
                  <Icon className="text-sm" />
                  {sts}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Appointments List */}
        <div className="space-y-6">
          {loading && (
            <div className="flex h-[300px] justify-center items-center">
              <Spinner
                size="medium"
                variant="primary"
                showText={true}
                text="Updating..."
              />
            </div>
          )}

          {appointments.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaCalendar className="text-2xl text-gray-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No {status.toLowerCase()} appointments
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {status === "Queue"
                  ? "You don't have any appointments in the queue."
                  : status === "Consultation"
                  ? "No appointments currently under consultation."
                  : "No closed appointments found in your history."}
              </p>
              <Button
                onClick={handleRefresh}
                size="medium"
                loading={loading}
                className="mt-5">
                <div className="flex items-center justify-center gap-2">
                  <LuRefreshCcw /> Refresh
                </div>
              </Button>
            </div>
          )}
          {appointments.length != 0 &&
            !loading &&
            appointments.map((appointment, idx) => {
              const statusConfigItem =
                statusConfig[appointment.status] || statusConfig.Queue;
              const StatusIcon = statusConfigItem.icon;
              const patient = appointment.patient || {};

              return (
                <div
                  key={appointment._id || idx}
                  className={`bg-white rounded-xl shadow-sm border-2 ${statusConfigItem.bgColor} transition-all hover:shadow-md`}>
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${statusConfigItem.bgColor}`}>
                          <StatusIcon
                            className={`text-xl ${statusConfigItem.color}`}
                          />
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfigItem.badgeColor}`}>
                            <StatusIcon className="text-xs" />
                            {appointment.status}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            Created: {formatDate(appointment.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Last updated: {formatDate(appointment.updatedAt)}
                      </div>
                    </div>

                    {/* Patient Info */}
                    <div className="border-t border-gray-100 pt-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FaUser className="text-primary" />
                        Patient Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-gray-500">
                              Name
                            </label>
                            <p className="text-gray-900 font-semibold">
                              {patient?.user?.name || "N/A"}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">NIC</label>
                            <p className="text-gray-900 font-mono">
                              {patient?.nic || "N/A"}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">
                              Email
                            </label>
                            <p className="text-gray-900">
                              {patient?.user?.email || "N/A"}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">
                              Patient Type
                            </label>
                            <p className="text-gray-900 capitalize">
                              {patient?.patientType || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <FaPhone className="text-gray-400 text-sm" />
                            <span className="text-gray-900">
                              {patient?.contact || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <FaMapMarkerAlt className="text-gray-400 text-sm mt-1" />
                            <span className="text-gray-900">
                              {patient?.address || "N/A"}
                            </span>
                          </div>
                          {patient?.dob && (
                            <div>
                              <label className="text-sm text-gray-500">
                                Date of Birth
                              </label>
                              <p className="text-gray-900">
                                {new Date(patient.dob).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {patient?.allergies?.length > 0 && (
                            <div>
                              <label className="text-sm text-gray-500 flex items-center gap-1">
                                <FaAllergies className="text-red-400" />
                                Allergies
                              </label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {patient.allergies.map((a, i) => (
                                  <span
                                    key={i}
                                    className="inline-block bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full border border-red-100">
                                    {a}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {appointment.status === "Queue" && (
                      <div className="border-t border-gray-100 pt-4 mt-4">
                        <Button
                          onClick={() =>
                            changeState("Consultation", appointment._id)
                          }
                          variant="primary"
                          size="small">
                          Start Consultation
                        </Button>
                      </div>
                    )}
                    {appointment.status === "Consultation" && (
                      <div className="flex justify-start gap-4 border-t border-gray-100 pt-4 mt-4">
                        <Button
                          onClick={() => changeState("Closed", appointment._id)}
                          variant="outline"
                          size="small"
                          className="min-w-[120px] flex items-center justify-center border-primary text-primary hover:bg-primary hover:text-white">
                          Close Appointment
                        </Button>
                        <Button
                          onClick={() =>
                            navigate(`/appointment/${patient._id}`)
                          }
                          variant="primary"
                          size="small">
                          Start Consultation
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
