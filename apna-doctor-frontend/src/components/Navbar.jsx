import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import stethoscopeIcon from "../assets/stethoscope-medical-tool.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 border-b-0 px-6 py-4 flex items-center justify-between shadow-lg">
      {/* Left — Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() =>
          navigate(user?.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard")
        }
      >
        <div className="w-11 h-11 bg-cyan-100 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
          <img src={stethoscopeIcon} alt="DocNow" className="w-8 h-8" />
        </div>
        <span className="text-2xl font-bold text-white">DocNow</span>
      </div>

      {/* Right — Role badge + logout */}
      {user && (
        <div className="flex items-center gap-6">
          <span
            className={`text-xs font-semibold px-4 py-2 rounded-full transition-colors ${
              user.role === "doctor"
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            }`}
          >
            {user.role === "doctor" ? "👨‍⚕️ Doctor" : "👤 Patient"}
          </span>

          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors hover:bg-red-50 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}