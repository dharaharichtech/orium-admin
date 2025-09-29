"use client"

import { createSlice } from "@reduxjs/toolkit";
import { getAllOrders, getOrderById, updateOrderStatusAPI } from "@/api/orderApi";

const initialState = {
  loading: false,
  orders: [],
  orderDetail: null,
  total: 0,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setOrders(state, action) {
      state.loading = false;
      state.orders = action.payload.orders;
      state.total = action.payload.total;
    },
    setOrderDetail(state, action) {
      state.loading = false;
      state.orderDetail = action.payload;
    },
    clearOrderDetail(state) {
      state.orderDetail = null;
    },
  updateOrderStatus(state, action) {
      state.loading = false;
      const { orderId, status } = action.payload;
      const orderIndex = state.orders.findIndex(
        (order) => order._id === orderId
      );
      if (orderIndex !== -1) {
        state.orders[orderIndex].status = status;
      }
      if (state.orderDetail && state.orderDetail._id === orderId) {
        state.orderDetail.status = status;
      }
    },
  },
});

export const { startLoading, setError, setOrders, setOrderDetail, clearOrderDetail , updateOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;

export const fetchOrders = (page = 1, limit = 10) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const data = await getAllOrders(page, limit);
    const ordersArray = data.orders || data;
    const totalCount = data.total || ordersArray.length;

    const formatted = ordersArray.map((order) => {
      return {
        _id: order._id,
        orderId: order.orderId,
        user_id: order.user_id,
        product_id: order.product_id,
        quantity: order.quantity,
        amount: order.amount,
        paymentInfo: order.paymentInfo,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
    });

    dispatch(setOrders({ orders: formatted, total: totalCount }));
  } catch (err) {
    dispatch(setError("Failed to fetch orders"));
  }
};

export const fetchOrderById = (orderId) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const data = await getOrderById(orderId);

    const formatted = {
      _id: data._id,
      orderId: data.orderId,
      user_id: data.user_id,
      product_id: data.product_id,
      quantity: data.quantity,
      amount: data.amount,
      paymentInfo: data.paymentInfo,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    dispatch(setOrderDetail(formatted));
  } catch (err) {
    dispatch(setError("Failed to fetch order details"));
  }
};

export const updateOrderStatusAsync = (orderId, status) => async (dispatch) => {
  try {
    dispatch(startLoading());
    await updateOrderStatusAPI(orderId, status); 
    dispatch(updateOrderStatus({ orderId, status })); 
  } catch (err) {
    dispatch(setError("Failed to update order status"));
  }
};

