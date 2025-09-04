import baseApi from "./baseApi";

export const getAllProducts = async () => {
  try {
    const response = await baseApi.get("/product/getall");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
