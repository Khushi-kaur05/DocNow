import API from "./api";

export const bookAppointment = async (data) => {
  const res = await API.post("/appointments/book", data);
  return res.data;
};