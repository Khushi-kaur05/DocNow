
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllDoctors } from "../services/doctorService";
import { bookAppointment, getDoctorAppointments } from "../services/appointmentService";
import DashboardLayout from "../components/DashboardLayout";
import DoctorCard from "../components/DoctorCard";
import SpecializationCard from "../components/SpecializationCard";
import { getDoctorAvailability } from "../services/availabilityServices";
import { FaHeartbeat, FaBone, FaBrain, FaUserMd, FaStethoscope, FaTooth, FaEye, FaLungs, FaChild, FaLeaf, FaSpinner } from "react-icons/fa";

export default function FindDoctor() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [showSpecializations, setShowSpecializations] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Booking form states
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [patientName, setPatientName] = useState(user?.name || "");
  const [patientAge, setPatientAge] = useState("");
  const [mode, setMode] = useState("online");
  const [availability, setAvailability] = useState(undefined);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);

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

  // ✅ Check if selected day is valid
  const isDayAvailable = (selectedDate) => {
    if (!availability) return false;

    const day = new Date(selectedDate).toLocaleString("en-US", {
      weekday: "short",
    });

    return availability.days?.includes(day);
  };

  // ✅ Check if slot is already booked
  const isSlotBooked = (selectedDate, selectedTime) => {
    return bookedSlots.some(slot => slot.date === selectedDate && slot.time === selectedTime);
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
        value: formatted,
      });
    }

    return slots;
  };

  // ✅ Fetch booked slots
  const fetchBookedSlots = async (doctorId) => {
    try {
      const appointments = await getDoctorAppointments(doctorId);
      const slots = appointments
        .filter(apt => apt.status !== "cancelled")
        .map(apt => ({
          date: apt.date,
          time: apt.time
        }));
      setBookedSlots(slots);
    } catch (error) {
      console.log("Error fetching booked slots:", error);
    }
  };

  // ✅ Fetch availability when doctor selected
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDoctor) return;

      try {
        setAvailability(undefined);

        const data = await getDoctorAvailability(selectedDoctor.userId._id);
        setAvailability(data);

        // Fetch booked slots for this doctor
        await fetchBookedSlots(selectedDoctor.userId._id);
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

      if (!patientName.trim()) {
        alert("Please enter patient name");
        return;
      }

      if (isSlotBooked(date, time)) {
        alert("This slot is already booked. Please select another slot.");
        return;
      }

      setBookingLoading(true);

      await bookAppointment({
        doctorId: selectedDoctor.userId._id,
        date,
        time,
        patientName: patientName.trim(),
        patientAge: patientAge ? parseInt(patientAge) : null,
        mode,
      });

      alert("Appointment booked successfully!");

      setSelectedDoctor(null);
      setDate("");
      setTime("");
      setPatientName(user?.name || "");
      setPatientAge("");
      setMode("online");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold text-white">Find a Doctor</h1>
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
            <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
              <div className="bg-white rounded-2xl w-full max-w-md shadow-xl max-h-screen overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        Book Appointment
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Dr. {selectedDoctor.userId?.name}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedDoctor(null)}
                      className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                      ×
                    </button>
                  </div>

                  {/* Availability Handling */}
                  {availability === undefined ? (
                    <p className="text-center text-gray-500 py-4">
                      Loading availability...
                    </p>
                  ) : !availability ? (
                    <p className="text-red-500 text-center py-4">
                      Doctor is currently not available
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {/* Patient Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Patient Name *
                        </label>
                        <input
                          type="text"
                          placeholder="Enter patient name"
                          className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          This could be for yourself or a family member
                        </p>
                      </div>

                      {/* Patient Age */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Age (Optional)
                        </label>
                        <input
                          type="number"
                          placeholder="Enter age"
                          min="1"
                          max="120"
                          className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                          value={patientAge}
                          onChange={(e) => setPatientAge(e.target.value)}
                        />
                      </div>

                      {/* Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date *
                        </label>
                        <input
                          type="date"
                          className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
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
                      </div>

                      {/* Time */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time Slot *
                        </label>
                        <select
                          className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                        >
                          <option value="">Select Time Slot</option>
                          {generateSlots().map((slot, index) => {
                            const isBooked = isSlotBooked(date, slot.label);
                            return (
                              <option 
                                key={index} 
                                value={slot.label}
                                disabled={isBooked}
                              >
                                {slot.label} {isBooked ? "- (Booked)" : ""}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* Mode */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Appointment Mode *
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="mode"
                              value="online"
                              checked={mode === "online"}
                              onChange={(e) => setMode(e.target.value)}
                              className="mr-2"
                            />
                            <span className="text-gray-700">📱 Online</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="mode"
                              value="offline"
                              checked={mode === "offline"}
                              onChange={(e) => setMode(e.target.value)}
                              className="mr-2"
                            />
                            <span className="text-gray-700">🏥 Offline (In-clinic)</span>
                          </label>
                        </div>
                      </div>

                      {/* Fee */}
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-gray-700 font-medium">
                          Consultation Fee: <span className="text-blue-600">₹{selectedDoctor?.consultationFee || "N/A"}</span>
                        </p>
                      </div>

                      {/* CTA */}
                      <button
                        onClick={handleBook}
                        disabled={!availability || bookingLoading}
                        className={`w-full py-2 rounded-lg font-medium transition ${
                          availability && !bookingLoading
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                      >
                        {bookingLoading ? "Booking..." : "Confirm Booking"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}