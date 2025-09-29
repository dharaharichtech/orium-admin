import axios from "axios";
import baseApi from "./baseApi";


const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token"); 
  }
  return null;
};



export const getAllProducts = async () => {
  try {
    const response = await baseApi.get("/product/getall");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};


// export const getAllProducts = async () => {
//   try {
//     const response = await axios.get("http://demo.harichtech.com/api/product/getall",{
//        withCredentials: true, 
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching products directly:", error);
//     throw error;
//   }
// };

export const getProductById = async (id) => {
  try {
    const response = await baseApi.get(`/product/getall/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

export const updateProduct = async (id, updatedData) => {
  const token = getAuthToken();
  const response = await baseApi.patch(`/product/update/${id}`, updatedData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const updateProductDetail = async (detailId, detailData) => {
  const token = getAuthToken();
  const response = await baseApi.patch(
    `/product/details/${detailId}`,
    detailData, 
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateProductCertificate = async (id, formData) => {
  try {
    const token = getAuthToken();
    const response = await baseApi.patch(`/product/certificate/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating certificate:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const token = getAuthToken();
    const response = await baseApi.delete(`/product/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw error;
  }
};



export const addProductDetail = async (detail) => {
  try {
    const token = getAuthToken(); 
    const response = await baseApi.post(`/product/details`, detail, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding product detail:", error);
    throw error.response?.data || error.message;
  }
};



export const addProductCertificate = async (data, files) => {
  try {
    const token = getAuthToken();
    const formData = new FormData();

    formData.append("product_id", data.product_id);
    formData.append("certificate_title", data.certificate_title);
    formData.append("sdg_title", data.sdg_title);

    if (files.certificate_img) formData.append("certificate_img", files.certificate_img[0]);
    if (files.sdg_img) formData.append("sdg_img", files.sdg_img[0]);

    const response = await baseApi.post("/product/certificate", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const addProduct = async (productData) => {
  try {
    const token = getAuthToken();
    const formData = new FormData();

    formData.append("title", productData.title);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("stock", productData.stock);

    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((img) => {
        formData.append("images", img);
      });
    }

    if (productData.videos && productData.videos.length > 0) {
      productData.videos.forEach((vid) => {
        formData.append("videos", vid);
      });
    }

    const response = await baseApi.post("/product/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
