import { useNavigate } from "react-router-dom";

const DoctorDashboardCard = ({ title, icon, route }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(route)}
      className="cursor-pointer bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-green-300 transition-all w-72 text-center"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm font-medium text-gray-700">{title}</p>
    </div>
  );
};

export default DoctorDashboardCard;