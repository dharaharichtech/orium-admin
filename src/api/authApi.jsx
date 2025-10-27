import baseApi from "./baseApi";
import axios from "axios";

export const getAllUsers = async () => {
  try {
    const response = await baseApi.get("/auth/allusers");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getCustomerById = async (id) => {
  try {
    const response = await baseApi.get(`/auth/allusers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    throw error;
  }
};

export const loginUserApi = async (email, password) => {
  try {
    const response = await baseApi.post("/auth/login", { email, password });

    const data = response.data;

   if (typeof window !== "undefined" && data?.token) {
      localStorage.setItem("token", data.token);
    }

    return {
      token: data.token,
      user: {
        userId: data.userId,
        role: data.role,
        firstname: "Admin",
        lastname: "",
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error.response?.data || error;
  }
};

export const verifyTokenApi = async (token) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-token`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("verifyTokenApi failed:", err?.response?.data || err.message);
    throw err; 
  }
};
