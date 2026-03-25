import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { getMyDoctorProfile } from "../services/doctorService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const {login} = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const data = await loginUser({ email, password });

        login(data);
        setMessage("Login successful!");

  // 🔥 separate try block
      if (data.user.role === "doctor") {
        try {
          const profileRes = await getMyDoctorProfile();

          if (!profileRes) {
            navigate("/complete-doctor-profile");
          } else {
            navigate("/doctor-dashboard");
          }
        } catch (err) {
          // if profile API fails, still allow flow
          navigate("/complete-doctor-profile");
        }
      } else {
        navigate("/patient-dashboard");
      }

    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed!");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-5 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </form>
      <p>
        Don't have an account?{" "}
        <Link to="/signup" style={{ color: "blue", textDecoration: "underline" }}>
          Sign Up
        </Link>
      </p>
      <p className="mt-2 text-red-500">{message}</p>
    </div>
  );
}
