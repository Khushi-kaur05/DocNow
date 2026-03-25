import { useEffect, useState } from "react";
import { getAllDoctors } from "../services/doctorService";
import { bookAppointment } from "../services/appointmentService";
import DashboardLayout from "../components/DashboardLayout";
import DoctorCard from "../components/DoctorCard";

export default function FindDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const timeSlots = [
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
];

  // 🔥 Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(specialization);
    }, 500);

    return () => clearTimeout(timer);
  }, [specialization]);

  // 🔥 Fetch doctors when debounced value changes
  useEffect(() => {
    fetchDoctors();
  }, [debouncedSearch]);

  const fetchDoctors = async () => {
    try {
      const params = {};

      if (debouncedSearch.trim() !== "") {
        params.specialization = debouncedSearch;
      }

      const data = await getAllDoctors(params);
      setDoctors(data.doctors);
    } catch (error) {
      console.log("Error fetching doctors", error);
    }
  };

  // 🔥 Booking function
  const handleBook = async () => {
    try {
      if (!date || !time) {
        alert("Please select date and time");
        return;
      }

      await bookAppointment({
        doctorId: selectedDoctor.userId._id,
        date,
        time,
      });

      alert("Appointment booked successfully!");

      // reset
      setSelectedDoctor(null);
      setDate("");
      setTime("");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Find a Doctor</h1>

        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search by specialization (e.g. Cardiologist)"
          className="border p-2 mb-4 w-80 rounded"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        />

        {/* 👨‍⚕️ Doctor List */}
        {doctors.length === 0 ? (
          <p>No doctors found</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {doctors.map((doc) => (
              <DoctorCard
                key={doc._id}
                doctor={doc}
                onBook={setSelectedDoctor}
              />
            ))}
          </div>
        )}

        {/* ✅ Modal (IMPORTANT: outside conditional block above) */}
        {selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-96">
              <h2 className="text-lg font-semibold mb-3">
                Book Appointment with {selectedDoctor.userId?.name}
              </h2>

              <input
                type="date"
                className="border p-2 mb-3 w-full"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <select
                className="border p-2 mb-3 w-full"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                >
                <option value="">Select Time Slot</option>
                {timeSlots.map((slot, index) => (
                    <option key={index} value={slot}>
                    {slot}
                    </option>
                ))}
                </select>

              

              <button
                onClick={handleBook}
                className="bg-green-500 text-white px-4 py-2 rounded w-full"
              >
                Confirm Booking
              </button>

              <button
                onClick={() => setSelectedDoctor(null)}
                className="mt-2 text-red-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}