import doctorProfileMale from "../assets/doctor-profile-male.png";
import doctorProfileFemale from "../assets/doctor-profile-female.png";

export default function DoctorCard({ doctor, onBook }) {
  const gender = doctor.userId?.gender || "male";
  const profileImage = gender === "female" ? doctorProfileFemale : doctorProfileMale;

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-200 group overflow-hidden h-full flex flex-col hover:border-indigo-400">
      
      {/* Top Section - Doctor Info */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={profileImage}
          alt={doctor.userId?.name}
          className="w-16 h-16 rounded-full object-cover shadow-md flex-shrink-0 group-hover:shadow-lg group-hover:scale-110 transition-all"
        />

        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
            Dr. {doctor.userId?.name}
          </h2>

          <p className="text-sm text-gray-600 font-medium">
            {doctor.degree}
          </p>

          <p className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold mt-1">
            {doctor.specialization}
          </p>
        </div>
      </div>

      {/* Hospital Info */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-3 mb-4 border border-blue-200">
        <p className="text-sm text-gray-800 font-medium">
          {doctor.hospital}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-blue-200 to-indigo-200 my-4"></div>

      {/* Fee Section */}
      <div className="mb-5">
        <p className="text-xs text-gray-500 font-semibold">Consultation Fee</p>
        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-1">
          ₹{doctor.consultationFee}
        </p>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => onBook(doctor)}
        className="mt-auto w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-bold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
      >
        Book Appointment
      </button>
    </div>
  );
}