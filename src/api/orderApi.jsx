
import baseApi from "./baseApi";

export const getAllOrders = async (page = 1, limit = 10,) => {
  try {
    const response = await baseApi.get("/product/orders", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await baseApi.get(`/product/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw error;
  }
};