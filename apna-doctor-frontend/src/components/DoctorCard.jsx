export default function DoctorCard({ doctor, onBook }) {
  return (
    <div className="border p-4 rounded-xl shadow-sm hover:shadow-md transition-all">
      
      <h2 className="text-lg font-semibold">
        {doctor.userId?.name}
      </h2>
      <h1 className="text-sm text-gray-600">
        {doctor.degree}
      </h1>

      <p className="text-gray-600">
        {doctor.specialization}
      </p>

      <p className="text-sm text-gray-500">
        {doctor.hospital}
      </p>

      <p className="text-sm font-medium mt-1">
        ₹ {doctor.consultationFee}
      </p>

      <button onClick = {()=>onBook(doctor)}
      className="mt-3 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
        Book Appointment
      </button>
      
    </div>
  );
}