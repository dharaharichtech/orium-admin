import { createSlice } from "@reduxjs/toolkit";
import * as productApi from "@/api/productApi";

const initialState = {
  loading: false,
  products: [],
  product: null,
  error: null,
  success: false,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    startLoading: (state) => { state.loading = true; state.error = null; state.success = false; },
    setError: (state, action) => { state.loading = false; state.error = action.payload; },
    setProducts: (state, action) => { state.loading = false; state.products = action.payload; },
    setProduct: (state, action) => { state.loading = false; state.product = action.payload; },
    setSuccess: (state, action) => { state.loading = false; state.success = action.payload; },
    setCertificates: (state, action) => {
      if (!state.product) return;
      state.product.certificates = [...(state.product.certificates || []), ...action.payload];
    },
  },
});

export const { startLoading, setError, setProducts, setProduct, setSuccess, setCertificates,removeProduct } = productSlice.actions;
export default productSlice.reducer;

export const fetchAllProducts = () => async (dispatch) => {
  try { dispatch(startLoading()); const data = await productApi.getAllProducts(); dispatch(setProducts(data)); }
  catch (err) { dispatch(setError(err.message || "Failed to fetch products")); }
};

export const fetchProductById = (productId) => async (dispatch) => {
  try { dispatch(startLoading()); const data = await productApi.getProductById(productId); dispatch(setProduct(data)); }
  catch (err) { dispatch(setError(err.message || "Failed to fetch product")); }
};

export const updateProductById = (id, formData) => async (dispatch) => {
  try { dispatch(startLoading()); await productApi.updateProduct(id, formData); dispatch(setSuccess(true)); }
  catch (err) { dispatch(setError(err.message || "Failed to update product")); }
};

export const updateProductDetails = (details) => async (dispatch) => {
  try {
    dispatch(startLoading());
    await Promise.all(details.map((d) => productApi.updateProductDetail(d._id, { ...d })));
    dispatch(setSuccess(true));
  } catch (err) { dispatch(setError(err.message || "Failed to update product details")); }
};




export const updateProductCertificates = (certs) => async (dispatch) => {
  try {
    dispatch(startLoading());
    await Promise.all(certs.map((c) => {
      const formData = new FormData();
      formData.append("product_id", c.product_id);
      if (c.certificate_title) formData.append("certificate_title", c.certificate_title);
      if (c.sdg_title) formData.append("sdg_title", c.sdg_title);
      if (c.certificate_file) formData.append("certificate_img", c.certificate_file);
      if (c.sdg_file) formData.append("sdg_img", c.sdg_file);
      return productApi.updateProductCertificate(c._id, formData);
    }));
    dispatch(setSuccess(true));
  } catch (err) { dispatch(setError(err.message || "Failed to update certificates")); }
};



export const addProduct = (formData) => async dispatch=>{
  try{
    dispatch(startLoading());
    const data = await productApi.addProduct(formData);
    dispatch(setProduct(data));
    dispatch(setSuccess(true));
    return data;
  }catch(err){ dispatch(setError(err.message||"Failed to add product")); throw err; }
};

export const addProductDetails = (details) => async dispatch=>{
  try{
    dispatch(startLoading());
    await Promise.all(details.map(d=>productApi.addProductDetail(d)));
    dispatch(setSuccess(true));
  }catch(err){ dispatch(setError(err.message||"Failed to add product details")); }
};

export const addProductCertificates = (certs) => async dispatch=>{
  try{
    dispatch(startLoading());
    const results = await Promise.all(certs.map(c=>{
      if(!c.product_id) throw new Error("Product ID required");
      const data={ product_id:c.product_id, certificate_title:c.certificate_title, sdg_title:c.sdg_title };
      const files = { certificate_img:c.certificate_file?[c.certificate_file]:null, sdg_img:c.sdg_file?[c.sdg_file]:null };
      return productApi.addProductCertificate(data,files);
    }));
    dispatch(setCertificates(results));
    dispatch(setSuccess(true));
  }catch(err){ dispatch(setError(err.message||"Failed to add certificates")); }
};


export const deleteProductById = (id) => async (dispatch, getState) => {
  try {
    dispatch(startLoading());
    await productApi.deleteProduct(id); 

    const { products } = getState().product; 
    const updatedProducts = products.filter((p) => p._id !== id);

    dispatch(setProducts(updatedProducts)); 
    dispatch(setSuccess(true));
  } catch (err) {
    dispatch(setError(err.message || "Failed to delete product"));
  }
};
