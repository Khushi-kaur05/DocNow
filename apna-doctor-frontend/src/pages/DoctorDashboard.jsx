import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import DoctorDashboardCard from "../components/DoctorDashboardCard";
import { useAuth } from "../context/AuthContext";
import { getMyDoctorAppointments } from "../services/appointmentService";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [newAppointmentCount, setNewAppointmentCount] = useState(0);

  useEffect(() => {
    fetchNewAppointmentCount();
    // Poll for new appointments every 30 seconds
    const interval = setInterval(fetchNewAppointmentCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNewAppointmentCount = async () => {
    try {
      const appointments = await getMyDoctorAppointments();
      const newCount = appointments.filter(apt => apt.isNew).length;
      setNewAppointmentCount(newCount);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-b from-cyan-50 via-blue-50 to-purple-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold text-white">Welcome, Dr. {user?.username}</h1>
            <p className="text-cyan-100 text-sm mt-2">Manage your practice and patient appointments</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><span className="w-1 h-8 bg-gradient-to-b from-cyan-600 to-blue-600 rounded"></span>Practice Management</h2>
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="w-full sm:w-80">
              <DoctorDashboardCard title="View Appointments" icon="📋" route="/my-appointments" notificationCount={newAppointmentCount}/>
            </div>
            <div className="w-full sm:w-80">
              <DoctorDashboardCard title="Set Availability" icon="⏰" route="/manage-availability"/>
            </div>
            <div className="w-full sm:w-80">
              <DoctorDashboardCard title="My Profile" icon="👨‍⚕️" route="/my-profile" gender={user?.gender}/>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}