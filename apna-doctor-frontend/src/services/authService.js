// src/services/authService.js
import API from "./api";

// Register user
export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

// Login user
export const loginUser = async (userData) => {
  const response = await API.post("/auth/login", userData);
  return response.data;
};