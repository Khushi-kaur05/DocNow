import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
      
      {/* Left — Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() =>
          navigate(user?.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard")
        }
      >
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">D</span>
        </div>
        <span className="text-lg font-semibold text-gray-800">DocNow</span>
      </div>

      {/* Right — Role badge + logout */}
      {user && (
        <div className="flex items-center gap-4">
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              user.role === "doctor"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {user.role === "doctor" ? "Doctor" : "Patient"}
          </span>

          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}