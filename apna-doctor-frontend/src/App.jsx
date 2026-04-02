import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Welcome from "./pages/Welcome";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import ProtectedRoute from "./components/ProtectedRoutes";
import CompleteDoctorProfile from "./pages/CompleteDoctorProfile";
import FindDoctor from "./pages/FindDoctor";
import ManageAvailability from "./pages/ManageAvailability";
import MyAppointments from "./pages/MyAppointments";
import MyProfile from "./pages/MyProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/welcome" element={<Welcome />} />

        {/* Doctor only */}
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/complete-doctor-profile" element={ <ProtectedRoute allowedRoles={["doctor"]}>
          <CompleteDoctorProfile />
          </ProtectedRoute>} />

        {/* Patient only */}
        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/find-doctor" element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <FindDoctor/>
          </ProtectedRoute>
        }
        />
        <Route path="/manage-availability" element={<ManageAvailability/>}/>
        
        {/* Shared routes */}
        <Route path="/my-appointments" element={
          <ProtectedRoute allowedRoles={["patient", "doctor"]}>
            <MyAppointments/>
          </ProtectedRoute>
        }
        />

        {/* Doctor Profile */}
        <Route path="/my-profile" element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <MyProfile/>
          </ProtectedRoute>
        }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;