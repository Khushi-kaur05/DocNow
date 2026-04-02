import API from "./api";

export const bookAppointment = async (data) => {
  const res = await API.post("/appointments/book", data);
  return res.data;
};

export const getPatientAppointments = async () => {
  const res = await API.get("/appointments/patient");
  return res.data;
};

export const getMyDoctorAppointments = async () => {
  const res = await API.get("/appointments/my-appointments");
  return res.data;
};

export const getDoctorAppointments = async (doctorId) => {
  const res = await API.get(`/appointments/doctor/${doctorId}`);
  return res.data;
};

export const deleteAppointment = async (appointmentId) => {
  const res = await API.delete(`/appointments/cancel/${appointmentId}`);
  return res.data;
};

export const completeAppointment = async (appointmentId) => {
  const res = await API.patch(`/appointments/complete/${appointmentId}`);
  return res.data;
};

export const markAppointmentAsViewed = async (appointmentId) => {
  const res = await API.patch(`/appointments/view/${appointmentId}`);
  return res.data;
};