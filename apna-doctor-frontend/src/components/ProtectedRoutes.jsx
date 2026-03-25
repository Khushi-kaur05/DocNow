import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getMyDoctorProfile } from "../services/doctorService";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  const [profileLoading, setProfileLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(true);
  const isProfileCompleteLocal = localStorage.getItem("doctorProfileComplete");


  useEffect(() => {
    const checkProfile = async () => {
      if (user?.role === "doctor") {
        setProfileLoading(true);
        try {
          const profile = await getMyDoctorProfile();
          setHasProfile(!!profile);
        } catch (err) {
          setHasProfile(false);
        }
        setProfileLoading(false);
      }
    };

    if (user) checkProfile();
  }, [user]);

  // Still reading from localStorage
  if (loading || profileLoading) return null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // 🔥 NEW LOGIC
  if (
  user.role === "doctor" &&
  !hasProfile &&
  !isProfileCompleteLocal &&
  window.location.pathname !== "/complete-doctor-profile"
) {
    return <Navigate to="/complete-doctor-profile" replace />;
  }

  return children;
}