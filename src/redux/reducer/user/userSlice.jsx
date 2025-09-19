"use client"

import { createSlice } from "@reduxjs/toolkit";
import { loginUserApi, getAllUsers, getCustomerById } from "@/api/authApi";

const initialState = {
  loading: false,
  userInfo: null,
  customers:[],
    customerDetail: null,
  total:0,
  error: null,
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
  },
});

export const { startLoading,setCustomers, setError,setCustomerDetail, setUserInfo, logout } = userSlice.actions;
export default userSlice.reducer;

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch(startLoading());
   
    const res = await loginUserApi(email, password);

    if (res.token) {
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
  async (dispatch) => {
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
          (a.email || "").toLowerCase().localeCompare((b.email || "").toLowerCase())
        );
      } else if (filterBy === "date") {
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date)); 
      }

      const start = (page - 1) * limit;
      const end = start + limit;
      const paginated = sorted.slice(start, end);

      const formatted = paginated.map((u) => {
        let profileImage = "U";
        if (u.profile) {
          profileImage = u.profile.startsWith("http")
            ? u.profile
            : `${process.env.API_BASE_URL}${u.profile}`;
        }

        return {
          _id: u._id,
          uid: u.uid,
          name: `${u.firstname || ""} ${u.lastname || ""}`,
          email: u.email,
          phone: u.phone,
          address: `${u.address || ""}, ${u.city || ""}, ${u.state || ""}, ${
            u.country || ""
          }, ${u.pincode || ""}`,
          status: u.isBlocked === 1 ? "Active" : "Blocked",
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

  export const fetchCustomerById = (id) => async (dispatch) => {
  try {
    dispatch(startLoading());
    const data = await getCustomerById(id);

    const user = data.user;

    let profileImage = "U";
    if (user.profile) {
      if (user.profile.startsWith("http")) {
        profileImage = user.profile;
      } else {
        profileImage = `${process.env.API_BASE_URL}${user.profile}`;
      }
    }

    const formatted = {
      ...user,
      profileImage,
    };

    dispatch(setCustomerDetail(formatted));
  } catch (err) {
    dispatch(setError("Failed to fetch customer details"));
  }
};
