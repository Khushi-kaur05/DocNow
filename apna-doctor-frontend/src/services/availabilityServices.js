import API from "./api";

export const saveAvailability = async (userData) => {
  const response = await API.post("/doctor/availability/save", userData);
  return response.data;
};

export const getAvailability = async () => {
  const response = await API.get("/doctor/availability/get");
  return response.data;
};