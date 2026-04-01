import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import DashboardCard from "../components/DashboardCard";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const {user} = useAuth();

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold text-white">Welcome, {user?.username}</h1>
            <p className="text-blue-100 text-sm mt-2">Manage your healthcare appointments and find doctors</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded"></span>Available Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <DashboardCard title="Find Doctor" icon="🔎" route="/find-doctor"/>
            <DashboardCard title="My Appointments" icon="📋" route="/my-appointments"/>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}