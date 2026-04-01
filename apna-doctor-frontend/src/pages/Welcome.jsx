import React from "react";
import { useLocation } from "react-router-dom";

const Welcome = () => {
  const location = useLocation();
  const name = location.state?.name || "User";
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white p-12 rounded-2xl shadow-lg border border-blue-100 w-full max-w-md text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
          <span className="text-3xl">✓</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {name}!</h2>
        <p className="text-gray-600">Your account has been successfully created.</p>
      </div>
    </div>
  );
};

export default Welcome;
