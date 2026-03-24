import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

export default function PatientDashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Patient Dashboard</h1>
      <div className="flex gap-5">
        <div
          className="cursor-pointer bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-green-300 transition-all w-48 text-center"
          onClick={() => navigate("/find-doctor")}
        >
          <div className="text-3xl mb-2">🔍</div>
          <p className="text-sm font-medium text-gray-700">Find Doctor</p>
        </div>

        <div
          className="cursor-pointer bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-green-300 transition-all w-48 text-center"
          onClick={() => navigate("/my-appointments")}
        >
          <div className="text-3xl mb-2">📅</div>
          <p className="text-sm font-medium text-gray-700">My Appointments</p>
        </div>
      </div>
    </DashboardLayout>
  );
}