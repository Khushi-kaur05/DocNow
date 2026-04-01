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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
            <p className="text-gray-600 mt-2">Add your professional information to get started</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                <input
                  name="specialization"
                  placeholder="e.g., Cardiology"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Degree</label>
                <input
                  name="degree"
                  placeholder="e.g., MD, MBBS"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Experience (Years)</label>
                <input
                  name="experience"
                  placeholder="e.g., 5"
                  type="number"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hospital Name</label>
                <input
                  name="hospital"
                  placeholder="e.g., Apollo Hospital"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Consultation Fee (₹)</label>
                <input
                  name="consultationFee"
                  placeholder="e.g., 500"
                  type="number"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Available Days</label>
                <input
                  name="availableDays"
                  placeholder="e.g., Mon,Tue,Fri"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition text-gray-900"
                />
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 active:scale-95">
                Save Profile
              </button>

            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}