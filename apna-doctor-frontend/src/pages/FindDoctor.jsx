
import { useEffect, useState } from "react";
import { getAllDoctors } from "../services/doctorService";
import { bookAppointment } from "../services/appointmentService";
import DashboardLayout from "../components/DashboardLayout";
import DoctorCard from "../components/DoctorCard";
import SpecializationCard from "../components/SpecializationCard";
import { getDoctorAvailability } from "../services/availabilityServices";
import { FaHeartbeat, FaBone, FaBrain, FaUserMd, FaStethoscope, FaTooth, FaEye, FaLungs, FaChild, FaLeaf, FaSpinner } from "react-icons/fa";

export default function FindDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [showSpecializations, setShowSpecializations] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // List of specializations and icons
  const specializations = [
    { name: "Cardiologist", icon: <FaHeartbeat /> },
    { name: "Orthopedic", icon: <FaBone /> },
    { name: "Neurologist", icon: <FaBrain /> },
    { name: "General Physician", icon: <FaUserMd /> },
    { name: "Pediatrician", icon: <FaChild /> },
    { name: "Dental", icon: <FaTooth /> },
    { name: "Ophthalmologist", icon: <FaEye /> },
    { name: "Pulmonologist", icon: <FaLungs /> },
    { name: "Ayurvedic", icon: <FaLeaf /> },
    { name: "Other", icon: <FaStethoscope /> },
  ];
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availability, setAvailability] = useState(undefined); // ✅ important

  // ✅ Check if selected day is valid
  const isDayAvailable = (selectedDate) => {
    if (!availability) return false;

    const day = new Date(selectedDate).toLocaleString("en-US", {
      weekday: "short",
    });

    return availability.days?.includes(day);
  };

  // ✅ Generate slots
  const generateSlots = () => {
    if (!availability) return [];

    const start = parseInt(availability.startTime);
    const end = parseInt(availability.endTime);

    let slots = [];

    for (let i = start; i < end; i++) {
      const formatted =
        i > 12
          ? `${i - 12}:00 PM`
          : i === 12
          ? "12:00 PM"
          : `${i}:00 AM`;

      slots.push({
        label: formatted,
        value: i,
      });
    }

    return slots;
  };

  // ✅ Fetch availability when doctor selected
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDoctor) return;

      try {
        setAvailability(undefined); // loading state

        const data = await getDoctorAvailability(
          selectedDoctor.userId._id
        );

        console.log("AVAILABILITY:", data);

        setAvailability(data); // null or object
      } catch (err) {
        console.log(err);
        setAvailability(null);
      }
    };

    fetchAvailability();
  }, [selectedDoctor]);

  // ✅ Debounce search
  useEffect(() => {
    if (!showSpecializations) {
      const timer = setTimeout(() => {
        setDebouncedSearch(specialization);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [specialization, showSpecializations]);

  // ✅ Fetch doctors
  useEffect(() => {
    if (!showSpecializations && debouncedSearch.trim() !== "") {
      fetchDoctors();
    }
  }, [debouncedSearch, showSpecializations]);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const params = {};

      if (debouncedSearch.trim() !== "") {
        params.specialization = debouncedSearch;
      }

      const data = await getAllDoctors(params);
      setDoctors(data.doctors);
    } catch (error) {
      console.log("Error fetching doctors", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Booking function
  const handleBook = async () => {
    try {
      if (!availability) {
        alert("Doctor not available");
        return;
      }

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

      setSelectedDoctor(null);
      setDate("");
      setTime("");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold text-white">
              Find a Doctor
            </h1>
            <p className="text-indigo-100 mt-1">Browse medical specialists and book appointments</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {showSpecializations ? (
            <>
              <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {specializations.map((spec) => (
                  <SpecializationCard
                    key={spec.name}
                    specialization={spec.name}
                    icon={spec.icon}
                    onClick={(name) => {
                      setSpecialization(name);
                      setShowSpecializations(false);
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-8">
                <button
                  className="text-white font-semibold text-sm px-5 py-2 rounded-lg border-0 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition shadow-md hover:shadow-lg"
                  onClick={() => {
                    setShowSpecializations(true);
                    setSpecialization("");
                  }}
                >
                  ← Back to Specializations
                </button>
                <span className="text-lg font-bold text-blue-700 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                  {specialization}
                </span>
              </div>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center mt-20">
                  <FaSpinner className="text-4xl text-blue-600 animate-spin mb-4" />
                  <p className="text-gray-600 font-semibold">Loading doctors...</p>
                </div>
              ) : doctors.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                  <p className="text-lg">No doctors found for this specialization</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
                  {doctors.map((doc) => (
                    <DoctorCard
                      key={doc._id}
                      doctor={doc}
                      onBook={(doc) => setSelectedDoctor(doc)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Modal for booking */}
          {selectedDoctor && (
            <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">
                  Book Appointment
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Dr. {selectedDoctor.userId?.name}
                </p>
                {/* Availability Handling */}
                {availability === undefined ? (
                  <p className="text-center text-gray-500 mb-4">
                    Loading availability...
                  </p>
                ) : !availability ? (
                  <p className="text-red-500 text-center mb-4">
                    Doctor is currently not available
                  </p>
                ) : (
                  <>
                    {/* Date */}
                    <input
                      type="date"
                      className="border p-2 mb-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400"
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
                    {/* Time */}
                    <select
                      className="border p-2 mb-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400"
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

                  </>
                )}
                {/* Fee */}
                <p className="mb-3 text-gray-800 font-medium">
                  Fee: ₹{selectedDoctor?.consultationFee}
                </p>
                {/* CTA */}
                <button
                  onClick={handleBook}
                  disabled={!availability}
                  className={`w-full py-2 rounded-lg font-medium transition ${
                    availability
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Request Booking
                </button>
                {/* Cancel */}
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="mt-3 text-red-500 text-sm w-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}