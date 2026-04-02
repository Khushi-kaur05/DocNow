import axios from "axios";

const API = axios.create({
  baseURL: "https://docnow-6ici.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((req) => {
  const stored = localStorage.getItem("user");
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.token) req.headers.Authorization = `Bearer ${parsed.token || parsed.accessToken}`;
  }
  return req;
});

export default API;