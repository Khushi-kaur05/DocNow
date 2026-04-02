import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import { getMyDoctorProfile, updateDoctorProfile } from "../services/doctorService";
import { FaSave, FaTimes, FaUser, FaPhone, FaMapMarkerAlt, FaDollarSign, FaVenus, FaMars } from "react-icons/fa";

export default function MyProfile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    specialization: "",
    degree: "",
    experience: "",
    hospital: "",
    consultationFee: "",
    address: "",
    bio: "",
    gender: "male"
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getMyDoctorProfile();
      setProfile(data);
      if (data) {
        setFormData({
          specialization: data.specialization || "",
          degree: data.degree || "",
          experience: data.experience || "",
          hospital: data.hospital || "",
          consultationFee: data.consultationFee || "",
          address: data.address || "",
          bio: data.bio || "",
          gender: user?.gender || "male"
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      if (!formData.specialization || !formData.specialization.trim()) {
        alert("Specialization is required");
        return;
      }

      setSaving(true);
      // Convert empty strings to empty for optional fields
      const dataToSend = {
        specialization: formData.specialization,
        degree: formData.degree || "",
        experience: formData.experience || "",
        hospital: formData.hospital || "",
        consultationFee: formData.consultationFee || "",
        address: formData.address || "",
        bio: formData.bio || "",
        gender: formData.gender || "male"
      };
      await updateDoctorProfile(dataToSend);
      
      // Update gender in auth context if changed
      if (formData.gender !== user?.gender) {
        updateUser({ gender: formData.gender });
      }
      
      alert("Profile updated successfully!");
      setEditing(false);
      fetchProfile();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    if (profile) {
      setFormData({
        specialization: profile.specialization || "",
        degree: profile.degree || "",
        experience: profile.experience || "",
        hospital: profile.hospital || "",
        consultationFee: profile.consultationFee || "",
        address: profile.address || "",
        bio: profile.bio || "",
        gender: user?.gender || "male"
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="bg-gradient-to-b from-cyan-50 via-blue-50 to-purple-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-b from-cyan-50 via-blue-50 to-purple-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="text-cyan-100 mt-1">Manage your doctor profile and consultation details</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Header with Edit Button */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <FaUser className="text-2xl text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Dr. {user?.name}</h2>
                  <p className="text-gray-600">{formData.specialization || "Specialization not set"}</p>
                </div>
              </div>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Specialization */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Specialization *
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Cardiologist"
                  />
                ) : (
                  <p className="text-gray-900 font-semibold py-2">{profile?.specialization || "Not set"}</p>
                )}
              </div>

              {/* Degree */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Degree/Qualification
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., MBBS, MD"
                  />
                ) : (
                  <p className="text-gray-900 font-semibold py-2">{profile?.degree || "Not set"}</p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Experience (Years)
                </label>
                {editing ? (
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 5"
                  />
                ) : (
                  <p className="text-gray-900 font-semibold py-2">{profile?.experience ? `${profile.experience} years` : "Not set"}</p>
                )}
              </div>

              {/* Consultation Fee */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaDollarSign className="text-green-600" /> Consultation Fee (₹)
                </label>
                {editing ? (
                  <input
                    type="number"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 500"
                  />
                ) : (
                  <p className="text-gray-900 font-semibold py-2">₹{profile?.consultationFee || "Not set"}</p>
                )}
              </div>

              {/* Hospital */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hospital/Clinic Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Apollo Hospital"
                  />
                ) : (
                  <p className="text-gray-900 font-semibold py-2">{profile?.hospital || "Not set"}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-600" /> Address
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 123 Main Street, City"
                  />
                ) : (
                  <p className="text-gray-900 font-semibold py-2">{profile?.address || "Not set"}</p>
                )}
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio/About
                </label>
                {editing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Write a brief bio about yourself..."
                  />
                ) : (
                  <p className="text-gray-900 font-semibold py-2">{profile?.bio || "Not set"}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender
                </label>
                {editing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-semibold py-2 flex items-center gap-2">
                    {formData.gender === "female" ? <FaVenus className="text-pink-600" /> : <FaMars className="text-blue-600" />}
                    {formData.gender ? (formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)) : "Not set"}
                  </p>
                )}
              </div>
            </div>

            {/* User Info (Read-only) */}
            <div className="border-t mt-8 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-gray-900 font-semibold">{profile?.userId?.name || user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900 font-semibold">{profile?.userId?.email || user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <FaPhone /> Phone
                  </p>
                  <p className="text-gray-900 font-semibold">{profile?.userId?.phone || user?.phone || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="text-gray-900 font-semibold capitalize">{user?.role}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {editing && (
              <div className="flex gap-4 mt-8 pt-6 border-t">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FaSave /> {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-semibold flex items-center justify-center gap-2"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
