import React from "react";

export default function SpecializationCard({ specialization, icon, onClick }) {
  // Color mapping for different specializations
  const colorMap = {
    "Cardiologist": "from-red-500 to-pink-500",
    "Orthopedic": "from-amber-500 to-orange-500",
    "Neurologist": "from-purple-500 to-indigo-500",
    "General Physician": "from-blue-500 to-cyan-500",
    "Pediatrician": "from-pink-400 to-yellow-400",
    "Dental": "from-white to-blue-400",
    "Ophthalmologist": "from-green-500 to-teal-500",
    "Pulmonologist": "from-indigo-500 to-purple-600",
    "Ayurvedic": "from-green-400 to-emerald-600",
    "Other": "from-gray-500 to-gray-600"
  };
  
  const bgGradient = colorMap[specialization] || "from-blue-500 to-blue-600";
  
  return (
    <div
      className="cursor-pointer bg-gradient-to-br from-white to-gray-50 hover:from-white hover:to-blue-50 transition-all rounded-2xl shadow-md hover:shadow-xl flex flex-col items-center p-6 m-2 min-w-[160px] border border-gray-200 hover:border-blue-300 group"
      onClick={() => onClick(specialization)}
    >
      <div className={`bg-gradient-to-br ${bgGradient} w-16 h-16 flex items-center justify-center rounded-2xl mb-4 shadow-lg text-white text-3xl group-hover:shadow-xl group-hover:scale-110 transition-all`}>
        {icon}
      </div>
      <span className="font-bold text-gray-900 text-base group-hover:text-blue-700 transition-colors text-center">
        {specialization}
      </span>
    </div>
  );
}
