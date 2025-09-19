"use client"

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/redux/reducer/user/userSlice";
import productReducer from "@/redux/reducer/product/productSlice";
import orderReducer from "@/redux/reducer/order/orderSlice";


export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
     order: orderReducer,
  },
});

export default store;
