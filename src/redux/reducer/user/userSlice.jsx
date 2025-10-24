"use client";

import { createSlice } from "@reduxjs/toolkit";
import { loginUserApi, getAllUsers, getCustomerById, verifyTokenApi } from "@/api/authApi";

const initialState = {
  loading: false,
  userInfo: null,
  customers: [],
  customerDetail: null,
  total: 0,
  error: null,
  isTokenValid: null,
};

const userSlice = createSlice({
  name: "user",
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
    setUserInfo(state, action) {
      state.loading = false;
      state.userInfo = action.payload;
    },
    setCustomers(state, action) {
      state.loading = false;
      state.customers = action.payload.users;
      state.total = action.payload.total;
    },
    setCustomerDetail(state, action) {
      state.loading = false;
      state.customerDetail = action.payload;
    },
    logout(state) {
      state.userInfo = null;
    },
    updateCustomerStatus(state, action) {
      const { id, status } = action.payload;

      // Update in list
      state.customers = state.customers.map((c) =>
        c._id === id ? { ...c, status } : c
      );

      // Update in detail with proper object spread
      if (state.customerDetail && state.customerDetail._id === id) {
        state.customerDetail = {
          ...state.customerDetail,
          status: status,
        };
      }
      
    },
     setTokenValid(state, action) {
      state.isTokenValid = action.payload; 
    },
  },
});

export const {
  setTokenValid,
  startLoading,
  setCustomers,
  setError,
  setCustomerDetail,
  setUserInfo,
  logout,
  updateCustomerStatus,
} = userSlice.actions;
export default userSlice.reducer;

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch(startLoading());

    const res = await loginUserApi(email, password);

   if (typeof window !== "undefined" && res.token) {
      localStorage.setItem("token", res.token);
    }
    dispatch(setUserInfo(res.user || res));
    return res;
  } catch (err) {
    dispatch(setError(err.msg || "Login failed"));
    throw err;
  }
};

export const fetchCustomers =
  ({ page = 1, limit = 10, filterBy = "all" }) =>
  async (dispatch, getState) => {
    try {
      dispatch(startLoading());
      const data = await getAllUsers();
      const usersArray = data.users || data;

      let sorted = [...usersArray];

      if (filterBy === "name") {
        sorted.sort((a, b) =>
          `${a.firstname || ""} ${a.lastname || ""}`
            .toLowerCase()
            .localeCompare(
              `${b.firstname || ""} ${b.lastname || ""}`.toLowerCase()
            )
        );
      } else if (filterBy === "email") {
        sorted.sort((a, b) =>
          (a.email || "")
            .toLowerCase()
            .localeCompare((b.email || "").toLowerCase())
        );
      } else if (filterBy === "date") {
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      }

      const start = (page - 1) * limit;
      const end = start + limit;
      const paginated = sorted.slice(start, end);

      const currentState = getState();
      const existingCustomers = currentState.user.customers || [];

      const formatted = paginated.map((u) => {
        let profileImage = "U";
        if (u.profile) {
          profileImage = u.profile.startsWith("http")
            ? u.profile
            : `${process.env.NEXT_PUBLIC_API_BASE_URL}${u.profile}`;
        }

        const existingCustomer = existingCustomers.find((c) => c._id === u._id);
        const customerStatus =
          existingCustomer?.status ||
          (u.isBlocked === 1 ? "Active" : "Blocked");

        return {
          _id: u._id,
          uid: u.uid,
          name: `${u.firstname || ""} ${u.lastname || ""}`,
          email: u.email,
          phone: u.phone,
          address: `${u.address || ""}, ${u.city || ""}, ${u.state || ""}, ${
            u.country || ""
          }, ${u.pincode || ""}`,
          // status: u.isBlocked === 1 ? "Active" : "Blocked",
          status: customerStatus,
          added: new Date(u.date).toLocaleDateString("en-GB"),
          avatar: profileImage,
        };
      });

      dispatch(setCustomers({ users: formatted, total: usersArray.length }));
    } catch (err) {
      dispatch(setError("Failed to fetch customers"));
    }
  };

//by id

export const fetchCustomerById = (id) => async (dispatch, getState) => {
  try {
    dispatch(startLoading());

    const currentState = getState();
    const existingCustomerInList = currentState.user.customers?.find(
      (c) => c._id === id
    );

    const data = await getCustomerById(id);

    const user = data.user;

    let profileImage = "U";
    if (user.profile) {
      if (user.profile.startsWith("http")) {
        profileImage = user.profile;
      } else {
        profileImage = `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.profile}`;
      }
    }

    const customerStatus =
      existingCustomerInList?.status ||
      (user.isBlocked === 1 ? "Active" : "Blocked");

    const formatted = {
      ...user,
      profileImage,
      status: customerStatus,
    };

    dispatch(setCustomerDetail(formatted));
  } catch (err) {
    dispatch(setError("Failed to fetch customer details"));
  }
};


export const verifyToken = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(setTokenValid(false));
      dispatch(logout());
      return;
    }

    const res = await verifyTokenApi(token);

    if (res?.user) {
      dispatch(setTokenValid(true));
      dispatch(
        setUserInfo({
          _id: res.user.userId,
          role: "Admin",
          issuedAt: res.user.issuedAt,
          expiresAt: res.user.expiresAt,
        })
      );
      return;
    }

    if (res?.valid === true || res?.isValid === true || res?.status === "ok") {
      dispatch(setTokenValid(true));
      return;
    }

    if (
      res?.valid === false ||
      res?.isValid === false ||
      res?.status === "invalid" ||
      res?.error === "invalid_token"
    ) {
      localStorage.removeItem("token");
      dispatch(setTokenValid(false));
      dispatch(logout());
      return;
    }

    if (process.env.NODE_ENV === "development") {
      console.debug("verifyToken: unexpected response shape:", res);
    }
    dispatch(setTokenValid(true));
  } catch (err) {
    console.error("verifyToken failed:", err);
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      dispatch(setTokenValid(false));
      dispatch(logout());
    } else {
      dispatch(setTokenValid(true));
    }
  }
};


