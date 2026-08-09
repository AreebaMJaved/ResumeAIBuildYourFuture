import axios from "axios";

// Create reusable axios instance
const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

// SIGNUP
export async function Signup({ username, email, password }) {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// LOGIN
export async function Login({ email, password }) {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (err) {
    
    console.log("❌ Status:", err.response?.status);
    console.log("❌ Server said:", err.response?.data);   // ← MOST IMPORTANT
    console.log("❌ Sent payload:", { email, password });
    throw err;
  }
}

// LOGOUT
export async function Logout() {
  try {
    const response = await api.post("/api/auth/logout");

    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// GET CURRENT USER
export async function Getme() {
  try {
    const response = await api.get("/api/auth/get-me");

    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}