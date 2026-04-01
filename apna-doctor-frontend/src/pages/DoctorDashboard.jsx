import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import DoctorDashboardCard from "../components/DoctorDashboardCard";
import { useAuth } from "../context/AuthContext"; 

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const {user} = useAuth();

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
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="w-1 h-6 bg-gradient-to-b from-cyan-600 to-blue-600 rounded"></span>Practice Management</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DoctorDashboardCard title="View Appointments" icon="📋" route="/my-appointments"/>
            <DoctorDashboardCard title="My Patients" icon="👥" route="/my-patients"/>
            <DoctorDashboardCard title="Set Availability" icon="⏰" route="/manage-availability"/>
            <DoctorDashboardCard title="Manage Schedule" icon="📅" route="/manage-appointments"/>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}