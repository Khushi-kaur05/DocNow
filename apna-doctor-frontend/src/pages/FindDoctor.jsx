import { useEffect, useState } from "react";
import { getAllDoctors } from "../services/doctorService";
import { bookAppointment } from "../services/appointmentService";
import DashboardLayout from "../components/DashboardLayout";
import DoctorCard from "../components/DoctorCard";
import { getAvailability, getDoctorAvailability } from "../services/availabilityServices";

export default function FindDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availability, setAvailability] = useState(null);
  const [mode, setMode] = useState("");
  
  const isDayAvailable = (selectedDate) => {
  if (!availability) return false;

  const day = new Date(selectedDate)
    .toLocaleString("en-US", { weekday: "short" });

  return availability.days?.includes(day);
};
  const generateSlots = () => {
  if (!availability) return [];

  const start = parseInt(availability.startTime);
  const end = parseInt(availability.endTime);

  let slots = [];

  for (let i = start; i < end; i++) {
    const formatted =
      i > 12 ? `${i - 12}:00 PM` :
      i === 12 ? "12:00 PM" :
      `${i}:00 AM`;

    slots.push({label:
    i > 12 ? `${i - 12}:00 PM` :
    i === 12 ? "12:00 PM" :
    `${i}:00 AM`,
    value: i // 🔥 IMPORTANT});
  });
}

  return slots;
};
  

  useEffect(() => {
  const fetchAvailability = async () => {
    if (!selectedDoctor) return;

    try {
      const data = await getDoctorAvailability(
        selectedDoctor.userId._id
      );

      console.log("AVAILABILITY:", data);

      setAvailability(data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchAvailability();
}, [selectedDoctor]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(specialization);
    }, 500);

    return () => clearTimeout(timer);
  }, [specialization]);

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
                onBook={(doc) => setSelectedDoctor(doc)}
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
                  onChange={(e) => {
                    const selected = e.target.value;

                    if (!isDayAvailable(selected)) {
                      alert("Doctor not available on this day");
                      return;
                    }

                    setDate(selected);
                  }}
                />
              <select
                className="border p-2 mb-3 w-full"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                >
                <option value="">Select Time Slot</option>
                {generateSlots().map((slot, index) => (
                    <option key={index} value={slot.value}>
                    {slot.label}
                    </option>
                ))}
                </select>

              <div className="flex gap-2 mb-3">
                {availability?.mode?.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-3 py-1 border rounded ${
                      mode === m ? "bg-blue-500 text-white" : ""
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <p className="mb-2">
                Fee: ₹{selectedDoctor?.consultationFee}
              </p>

              <button
                onClick={handleBook}
                className="bg-green-500 text-white px-4 py-2 rounded w-full"
              >
                Request booking
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