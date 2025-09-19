import baseApi from "./baseApi";


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

    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      console.log("Token saved in localStorage:", response.data.token);
    }

    return response.data; 
  } catch (error) {
    console.error("Login error:", error);
    throw error.response?.data || error;
  }
};
