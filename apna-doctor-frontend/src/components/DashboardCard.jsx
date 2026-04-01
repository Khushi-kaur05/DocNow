import { useNavigate } from "react-router-dom";
import patientIcon from "../assets/find.png";
import medicalIcon from "../assets/medical.png";

export default function DashboardCard({title , icon , route}){
    const navigate = useNavigate()

    return (
        <div onClick={() => navigate(route)}
        className="cursor-pointer bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-blue-200 group h-40 flex flex-col items-center justify-center text-center hover:border-blue-500 hover:from-blue-50 hover:to-indigo-50">
            {title === "Find Doctor" ? (
                <img 
                    src={patientIcon} 
                    alt={title} 
                    className="w-14 h-14 rounded-full mb-3 object-cover border-3 border-blue-300 group-hover:border-blue-500 transition-colors shadow-md"
                />
            ) : title === "My Appointments" ? (
                <img 
                    src={medicalIcon} 
                    alt={title} 
                    className="w-14 h-14 mb-3 object-cover"
                />
            ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-lg flex items-center justify-center mb-3 group-hover:from-emerald-500 group-hover:to-emerald-600 transition-all shadow-md">
                    <span className="text-xl font-bold text-white">{title.charAt(0)}</span>
                </div>
            )}
            <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{title}</h3>
            <p className="text-xs text-gray-500 mt-2">Access service</p>
        </div>
    )
}