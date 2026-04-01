import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { getMyDoctorProfile } from "../services/doctorService";
import stethoscopeIcon from "../assets/stethoscope-medical-tool.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {login} = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
        const data = await loginUser({ email, password });
        login(data);
        setMessage("Login successful!");
        if (data.user.role === "doctor") {
          try {
            const profileRes = await getMyDoctorProfile();
            if (!profileRes) {
              navigate("/complete-doctor-profile");
            } else {
              navigate("/doctor-dashboard");
            }
          } catch (err) {
            navigate("/complete-doctor-profile");
          }
        } else {
          navigate("/patient-dashboard");
        }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Band */}
          <div className="h-28 bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center relative">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                <img src={stethoscopeIcon} alt="DocNow" className="w-10 h-10" />
              </div>
              <p className="text-white text-xs font-semibold tracking-wide">DocNow Healthcare</p>
            </div>
          </div>
          
          <div className="p-6">
            {/* Logo/Title */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
              <p className="text-gray-600 text-xs mt-1">Access your DocNow account</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition text-gray-900 text-sm"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition text-gray-900 text-sm"
                  required
                />
              </div>

              {/* Login Button */}
              <button type="submit" disabled={loading} className="w-full mt-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg font-bold text-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Error/Success Message */}
            {message && (
              <div className={`mt-3 p-2 rounded-lg text-center text-xs font-medium ${
                message.includes("successful") 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {message}
              </div>
            )}

            {/* Signup Link */}
            <p className="mt-4 text-center text-xs text-gray-700">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 font-bold hover:text-blue-700 transition">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
