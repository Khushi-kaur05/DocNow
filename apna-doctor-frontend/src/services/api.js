import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically if exists in localStorage
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;