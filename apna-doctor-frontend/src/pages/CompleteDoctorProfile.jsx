import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { createDoctorProfile } from "../services/doctorService";

export default function CompleteDoctorProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    specialization: "",
    degree: "",
    experience: "",
    hospital: "",
    consultationFee: "",
    availableDays: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createDoctorProfile({
        ...form,
        availableDays: form.availableDays.split(","),
      });
      localStorage.setItem("doctorProfileComplete", "true");

      navigate("/doctor-dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">
          Complete Your Doctor Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="specialization"
            placeholder="Specialization"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            name="degree"
            placeholder="Degree"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            name="experience"
            placeholder="Experience (years)"
            type="number"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            name="hospital"
            placeholder="Hospital Name"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            name="consultationFee"
            placeholder="Consultation Fee"
            type="number"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            name="availableDays"
            placeholder="Available Days (e.g. Mon,Tue,Fri)"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Save Profile
          </button>

        </form>
      </div>
    </DashboardLayout>
  );
}