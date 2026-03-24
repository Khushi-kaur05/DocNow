import { useNavigate } from "react-router-dom";

export default function DoctorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex gap-5 p-5">
      <div className="card" onClick={() => navigate("/add-slots")}>
        Add Time Slots
      </div>

      <div className="card" onClick={() => navigate("/requests")}>
        View Requests
      </div>
    </div>
  );
}