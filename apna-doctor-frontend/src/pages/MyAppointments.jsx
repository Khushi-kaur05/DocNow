import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import { 
  getPatientAppointments, 
  getMyDoctorAppointments,
  deleteAppointment,
  completeAppointment,
  markAppointmentAsViewed
} from "../services/appointmentService";
import { FaCalendar, FaClock, FaPhone, FaTrash, FaCheckCircle, FaBell } from "react-icons/fa";

export default function MyAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = user?.role === "doctor" 
        ? await getMyDoctorAppointments()
        : await getPatientAppointments();
      
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      alert("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await deleteAppointment(appointmentId);
        alert("Appointment cancelled successfully");
        fetchAppointments();
      } catch (error) {
        alert(error.response?.data?.message || "Failed to cancel appointment");
      }
    }
  };

  const handleComplete = async (appointmentId) => {
    try {
      await completeAppointment(appointmentId);
      alert("Appointment marked as completed");
      fetchAppointments();
    } catch (error) {
      alert("Failed to complete appointment");
    }
  };

  const handleMarkAsViewed = async (appointmentId) => {
    try {
      await markAppointmentAsViewed(appointmentId);
      fetchAppointments();
    } catch (error) {
      console.error("Error marking as viewed:", error);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.date) - new Date(b.date);
    }
    return a.status.localeCompare(b.status);
  });

  const activeAppointments = sortedAppointments.filter(a => a.status !== "cancelled");
  const newAppointmentCount = activeAppointments.filter(a => a.isNew).length;

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {user?.role === "doctor" ? "Manage Appointments" : "My Appointments"}
                </h1>
                <p className="text-indigo-100 mt-1">
                  {user?.role === "doctor" ? "Handle patient appointment requests" : "View and manage your booked appointments"}
                </p>
              </div>
              {user?.role === "doctor" && newAppointmentCount > 0 && (
                <div className="bg-red-500 text-white rounded-full px-6 py-3 flex items-center gap-2 shadow-lg">
                  <FaBell className="text-lg" />
                  <span className="text-lg font-bold">{newAppointmentCount} New</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Filter/Sort Section */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <label className="text-gray-700 font-semibold mr-4">Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date</option>
                <option value="status">Status</option>
              </select>
            </div>
            <div className="text-gray-600">
              Total Appointments: <span className="font-bold text-blue-600">{activeAppointments.length}</span>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading appointments...</p>
            </div>
          ) : activeAppointments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No appointments yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {activeAppointments.map((appointment) => (
                <div 
                  key={appointment._id} 
                  className={`rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-4 ${
                    user?.role === "doctor" && appointment.isNew 
                      ? "border-red-600 bg-red-50" 
                      : "border-indigo-600 bg-white"
                  }`}
                  onClick={() => {
                    if (user?.role === "doctor" && appointment.isNew) {
                      handleMarkAsViewed(appointment._id);
                    }
                  }}
                >
                  {/* New Notification Badge - Only for Doctors */}
                  {user?.role === "doctor" && appointment.isNew && (
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        <div className="w-3 h-3 bg-red-300 rounded-full animate-pulse"></div>
                        New
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Section - Date & Time */}
                    <div className="border-r md:border-r border-gray-200">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FaCalendar className="text-blue-600" />
                          <span className="text-gray-600 font-semibold">Date</span>
                        </div>
                        <p className="text-xl font-semibold text-gray-900 ml-6">
                          {new Date(appointment.date).toLocaleDateString('en-IN', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FaClock className="text-green-600" />
                          <span className="text-gray-600 font-semibold">Time</span>
                        </div>
                        <p className="text-xl font-semibold text-gray-900 ml-6">
                          {appointment.time}
                        </p>
                      </div>
                    </div>

                    {/* Middle Section - Doctor/Patient Info */}
                    <div className="border-r md:border-r border-gray-200">
                      {user?.role === "doctor" ? (
                        <>
                          <div className="mb-4">
                            <p className="text-gray-600 text-sm font-semibold mb-1">Patient Name</p>
                            <p className="text-lg font-semibold text-gray-900">{appointment.patientName}</p>
                          </div>
                          {appointment.patientAge && (
                            <div className="mb-4">
                              <p className="text-gray-600 text-sm font-semibold mb-1">Age</p>
                              <p className="text-lg font-semibold text-gray-900">{appointment.patientAge} years</p>
                            </div>
                          )}
                          {appointment.patientPhone && (
                            <div className="flex items-center gap-2">
                              <FaPhone className="text-blue-600" />
                              <p className="text-gray-900 font-semibold">{appointment.patientPhone}</p>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="mb-4">
                            <p className="text-gray-600 text-sm font-semibold mb-1">Doctor</p>
                            <p className="text-lg font-semibold text-gray-900">
                              Dr. {appointment.doctorId?.name}
                            </p>
                          </div>
                          <div className="mb-4">
                            <p className="text-gray-600 text-sm font-semibold mb-1">Specialization</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {appointment.doctorProfileId?.specialization}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm font-semibold mb-1">Email</p>
                            <p className="text-gray-900">{appointment.doctorId?.email}</p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Right Section - Mode, Status & Actions */}
                    <div>
                      <div className="mb-4">
                        <p className="text-gray-600 text-sm font-semibold mb-1">Mode</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          appointment.mode === "online" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-purple-100 text-purple-800"
                        }`}>
                          {appointment.mode === "online" ? "📱 Online" : "🏥 Offline"}
                        </span>
                      </div>

                      <div className="mb-6">
                        <p className="text-gray-600 text-sm font-semibold mb-1">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        {user?.role === "doctor" ? (
                          <>
                            {appointment.status === "approved" && (
                              <button
                                onClick={() => handleComplete(appointment._id)}
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-semibold"
                              >
                                <FaCheckCircle /> Mark Complete
                              </button>
                            )}
                            {appointment.status !== "completed" && (
                              <button
                                onClick={() => handleDelete(appointment._id)}
                                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 font-semibold"
                              >
                                <FaTrash /> Cancel
                              </button>
                            )}
                          </>
                        ) : (
                          appointment.status !== "completed" && (
                            <button
                              onClick={() => handleDelete(appointment._id)}
                              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 font-semibold"
                            >
                              <FaTrash /> Cancel Appointment
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
