import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

export default function DoctorDashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Doctor Dashboard</h1>
      <div className="flex gap-5">
        <div
          className="cursor-pointer bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all w-48 text-center"
          onClick={() => navigate("/add-slots")}
        >
          <div className="text-3xl mb-2">🗓️</div>
          <p className="text-sm font-medium text-gray-700">Add Time Slots</p>
        </div>

        <div
          className="cursor-pointer bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all w-48 text-center"
          onClick={() => navigate("/requests")}
        >
          <div className="text-3xl mb-2">📋</div>
          <p className="text-sm font-medium text-gray-700">View Requests</p>
        </div>
      </div>
    </DashboardLayout>
  );
}