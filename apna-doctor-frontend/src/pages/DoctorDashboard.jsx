import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import DoctorDashboardCard from "../components/DoctorDashboardCard";
import { useAuth } from "../context/AuthContext"; 

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const {user} = useAuth();


  return (
    <DashboardLayout>
        <h1 className="text-xl font-bold text-center text-blue-900 mb-5">WELCOME, Dr. {user?.username}! Patients have been waiting for you since a while!</h1>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Doctor Dashboard</h1>
      <div className="flex gap-5 flex-wrap">
        <DoctorDashboardCard title = "View Appointments" icon="📅" route="/my-appointments"/>
        <DoctorDashboardCard title = "My Patients" icon="👥" route="/my-patients"/>
        <DoctorDashboardCard title = "Manage Availability" icon="🕒" route="/manage-availability"/>
        <DoctorDashboardCard title = "Manage Appointments" icon="📋" route="/manage-appointments"/>

      </div>
    </DashboardLayout>
  );
}