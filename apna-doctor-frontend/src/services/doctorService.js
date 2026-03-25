import API from "./api";

// create profile
export const createDoctorProfile = async (data) => {
  const res = await API.post("/doctors/create-profile", data);
  return res.data;
};

// get logged-in doctor profile
export const getMyDoctorProfile = async () => {
  const res = await API.get("/doctors/my-profile");
  return res.data;
};

// get all doctors (for find doctor)
export const getAllDoctors = async (params) => {
  const res = await API.get("/doctors", { params });
  return res.data;
};