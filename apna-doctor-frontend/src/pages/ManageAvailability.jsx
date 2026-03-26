import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { saveAvailability } from "../services/availabilityServices";
const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ManageAvailability = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [mode, setMode] = useState([]);
  const [isEmergencyAvailable, setIsEmergencyAvailable] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
  <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">

    <h2 className="text-2xl font-bold text-gray-800 mb-6">
      Manage Availability
    </h2>

    {successMessage && (
    <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
        {successMessage}
    </div>
    )}

    {/* DAYS */}
    <div className="mb-6">
      <p className="font-medium mb-2">Select Days</p>
      <div className="flex flex-wrap gap-2">
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
            className={`px-4 py-2 rounded-full text-sm font-medium border transition
              ${
                selectedDays.includes(day)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>

    {/* TIME */}
    <div className="mb-6">
      <p className="font-medium mb-2">Select Time Range</p>
      <div className="flex gap-4">
        <select
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">Start Time</option>
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

        <select
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">End Time</option>
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

    {/* MODE */}
    <div className="mb-6">
      <p className="font-medium mb-2">Consultation Mode</p>
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
            className={`px-4 py-2 rounded-lg border capitalize transition
              ${
                mode.includes(m)
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>

    {/* EMERGENCY */}
    <div className="mb-6 flex items-center justify-between">
      <p className="font-medium">Emergency Availability</p>

      <button
        onClick={() => setIsEmergencyAvailable(!isEmergencyAvailable)}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition
          ${isEmergencyAvailable ? "bg-green-500" : "bg-gray-300"}`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition
            ${isEmergencyAvailable ? "translate-x-6" : ""}`}
        />
      </button>
    </div>

    {/* SAVE BUTTON */}
    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
    onClick={saveAvailabilityChange}>
      Save Availability
    </button>

  </div>
</div>
    </DashboardLayout>
  );
};

export default ManageAvailability;