import { useNavigate } from "react-router-dom";
import medicalIcon from "../assets/medical.png";
import availabilityIcon from "../assets/availability.png";
import myprofilefemale from "../assets/myprofilefemale.png"
import myprofilemale from "../assets/myprofilemale.png"


const DoctorDashboardCard = ({ title, icon, route, notificationCount = 0, gender = "male" }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(route)}
      className="cursor-pointer bg-gradient-to-br from-white via-cyan-50 to-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-cyan-200 text-center group hover:border-cyan-400 hover:scale-105 h-48 flex flex-col items-center justify-center relative"
    >
      {/* Notification Badge */}
      {notificationCount > 0 && (
        <div className="absolute top-2 right-2">
          <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse"></div>
            {notificationCount}
          </div>
        </div>
      )}

      {title === "View Appointments" ? (
        <img 
          src={medicalIcon} 
          alt={title} 
          className="w-14 h-14 mb-2 object-cover"
        />
      ) : title === "Set Availability" ? (
        <img 
          src={availabilityIcon} 
          alt={title} 
          className="w-14 h-14 mb-2 object-cover"
        />
      ) : title === "My Profile" ? (
        <img
          src={gender === "female" ? myprofilefemale : myprofilemale}
          alt={title}
          className="w-14 h-14 mb-2 object-cover rounded-lg"
        />
      ) : (
        <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:from-cyan-500 group-hover:to-blue-600 transition-all shadow-md">
          <span className="text-xl font-bold text-white">{title.charAt(0)}</span>
        </div>
      )}

      <h3 className="text-lg font-bold text-gray-900 group-hover:text-cyan-700 transition-colors mt-2">{title}</h3>
      <p className="text-sm text-gray-500 mt-2 font-medium">Manage</p>
    </div>
  );
};

export default DoctorDashboardCard;