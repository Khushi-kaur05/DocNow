import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { saveAvailability, getAvailability} from "../services/availabilityServices";
const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ManageAvailability = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [mode, setMode] = useState([]);
  const [isEmergencyAvailable, setIsEmergencyAvailable] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

 useEffect(() => {
  const fetchAvailability = async () => {
    try {
      console.log("Fetching availability...");

      const data = await getAvailability();

      console.log("API DATA:", data);

      if (!data) return;

      setSelectedDays(data.days || []);
      setStartTime(data.startTime || "");
      setEndTime(data.endTime || "");
      setMode(data.mode || []);
      setIsEmergencyAvailable(data.isEmergencyAvailable || false);

    } catch (err) {
      console.log("ERROR:", err);
    }
  };

  fetchAvailability();
}, []);
  const saveAvailabilityChange = async () => {
  try {
    const response = await saveAvailability({
      days: selectedDays,
      startTime,
      endTime,
      mode,
      isEmergencyAvailable,
    });

    setSuccessMessage("Availability saved successfully ✅");

    // auto hide after 3 sec
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

  } catch (error) {
    console.error("Error saving availability:", error);
  }
};
  return (
    <DashboardLayout>
      <div className="bg-gradient-to-b from-cyan-50 via-blue-50 to-indigo-50 min-h-screen py-12 px-6">
        <div className="w-full max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-8 bg-gradient-to-b from-cyan-600 to-blue-600 rounded"></span>
              <h1 className="text-3xl font-bold text-gray-900">Manage Availability</h1>
            </div>
            <p className="text-gray-600 mt-2 ml-3">Set your working hours and availability</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-100 text-emerald-700 font-medium border border-emerald-300 flex items-center gap-3 shadow-md">
              <span className="text-lg">✅</span>
              {successMessage}
            </div>
          )}

          {/* Main Card */}
          <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl shadow-lg p-8 border border-cyan-200">

            {/* DAYS SELECTION */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="w-1 h-6 bg-gradient-to-b from-cyan-600 to-blue-600 rounded\"></span>Select Working Days</h3>
              <div className="flex flex-wrap gap-3">
                {daysList.map((day) => (
                  <button
                    key={day}
                    onClick={() => {
                      setSelectedDays((prev) =>
                        prev.includes(day)
                          ? prev.filter((d) => d !== day)
                          : [...prev, day]
                      );
                    }}
                    className={`px-5 py-2 rounded-lg text-sm font-bold border-2 transition duration-200 shadow-sm ${
                      selectedDays.includes(day)
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-600 shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:border-cyan-400 hover:bg-cyan-50"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* TIME SELECTION */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Set Time Range</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition text-gray-900"
                  >
                    <option value="">Select Start Time</option>
                    {[...Array(12)].map((_, i) => {
                      const hour = i + 8;
                      const formattedHour =
                      hour > 12 ? `${hour - 12}:00 PM` :
                      hour === 12 ? "12:00 PM" :
                      `${hour}:00 AM`;
                      return (
                        <option key={hour} value={hour}>
                          {formattedHour}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition text-gray-900"
                  >
                    <option value="">Select End Time</option>
                    {[...Array(12)].map((_, i) => {
                      const hour = i + 8;
                      const formattedHour =
                      hour > 12 ? `${hour - 12}:00 PM` :
                      hour === 12 ? "12:00 PM" :
                      `${hour}:00 AM`;
                      return (
                        <option key={hour} value={hour}>
                          {formattedHour}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            {/* CONSULTATION MODE */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="w-1 h-6 bg-gradient-to-b from-cyan-600 to-blue-600 rounded\"></span>Consultation Mode</h3>
              <div className="flex gap-4">
                {["online", "offline"].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMode((prev) =>
                        prev.includes(m)
                          ? prev.filter((item) => item !== m)
                          : [...prev, m]
                      );
                    }}
                    className={`px-6 py-3 rounded-lg border-2 font-bold capitalize transition duration-200 shadow-sm ${
                      mode.includes(m)
                        ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-600 shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50"
                    }`}
                  >
                    {m === "online" ? "🌐 Online" : "🏥 Offline"}
                  </button>
                ))}
              </div>
            </div>

            {/* EMERGENCY AVAILABILITY */}
            <div className="mb-8 pb-8 border-b border-cyan-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Emergency Availability</h3>
                <p className="text-sm text-gray-600 mt-1">Allow patients to book emergency slots</p>
              </div>
              <button
                onClick={() => setIsEmergencyAvailable(!isEmergencyAvailable)}
                className={`relative w-14 h-8 rounded-full transition duration-300 flex items-center shadow-md ${
                  isEmergencyAvailable ? "bg-gradient-to-r from-cyan-500 to-blue-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${
                    isEmergencyAvailable ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* SAVE BUTTON */}
            <button 
              className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 active:scale-95 text-lg"
              onClick={saveAvailabilityChange}
            >
              ✓ Save Availability
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageAvailability;