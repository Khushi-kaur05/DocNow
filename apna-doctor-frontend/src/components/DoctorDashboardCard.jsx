import { useNavigate } from "react-router-dom";
import medicalIcon from "../assets/medical.png";

const DoctorDashboardCard = ({ title, icon, route }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(route)}
      className="cursor-pointer bg-gradient-to-br from-white to-cyan-50 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-cyan-200 text-center group hover:border-cyan-500 hover:from-cyan-50 hover:to-blue-50 h-32 flex flex-col items-center justify-center"
    >
      {title === "View Appointments" ? (
        <img 
          src={medicalIcon} 
          alt={title} 
          className="w-10 h-10 mb-2 object-cover"
        />
      ) : (
        <div className="w-11 h-11 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:from-cyan-500 group-hover:to-blue-600 transition-all shadow-md">
          <span className="text-sm font-bold text-white">{title.charAt(0)}</span>
        </div>
      )}
      <h3 className="text-sm font-bold text-gray-900 group-hover:text-cyan-700 transition-colors">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">Manage</p>
    </div>
  );
};

export default DoctorDashboardCard;