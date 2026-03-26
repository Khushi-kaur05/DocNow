import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import DashboardCard from "../components/DashboardCard";



export default function PatientDashboard() {
  const navigate = useNavigate();
  const {user} = useAuth();
  console.log("User in Patient =========", user);

  return (
    <DashboardLayout>
        
        <h1 className="text-xl font-bold text-center text-blue-900 mb-5">WELCOME,  {user?.username}! How can we help you today?</h1>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Patient Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <DashboardCard title = "Find Doctor" icon="🔍" route="/find-doctor"/>
        <DashboardCard title = "My Appointments" icon="📅" route="/my-appointments"/>
      </div>
    </DashboardLayout>
  );
}