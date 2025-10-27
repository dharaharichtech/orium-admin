"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Orders from "../orders/Orders";
import { getAllOrders } from "@/api/orderApi";
import { Calendar, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllProducts } from "@/api/productApi";
import { getAllUsers } from "@/api/authApi";
import { useSelector, useDispatch } from "react-redux";
import { logout, verifyToken } from "@/redux/reducer/user/userSlice";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState("");
  const [recentOrders, setRecentOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const isTokenValid = useSelector((state) => state.user.isTokenValid);

  const router = useRouter();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const userInfo = useSelector((state) => state.user.userInfo);
  // const token =
  //   typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
useEffect(() => {
  if (typeof window !== "undefined") {
    console.log("Stored Token:", localStorage.getItem("token"));
  }
}, []);

useEffect(() => {
  if (!token) {
    router.replace("/login");
  }
}, [token]);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getAllOrders();

        const ordersArray = res.orders || res.data || res || [];

        if (ordersArray.length > 0) {
          const sorted = [...ordersArray].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          setRecentOrders(sorted.slice(0, 3));
        } else {
          setRecentOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const productsRes = await getAllProducts();
        setProductsCount(productsRes?.length || 0);

        const ordersRes = await getAllOrders();
        const ordersArray =
          ordersRes.orders || ordersRes.data || ordersRes || [];
        setOrdersCount(ordersArray.length);
        const totalRevenue = ordersArray.reduce(
          (sum, order) => sum + (order.amount || 0),
          0
        );
        setRevenue(totalRevenue);

        const usersRes = await getAllUsers(1, 10000);
        setCustomersCount(usersRes?.users?.length || usersRes?.length || 0);

        if (ordersArray.length > 0) {
          const sorted = [...ordersArray].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setRecentOrders(sorted.slice(0, 3));
        } else {
          setRecentOrders([]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    router.push("/login");
  };

  useEffect(() => {
    if (token) {
      dispatch(verifyToken());
      const interval = setInterval(() => dispatch(verifyToken()), 1800000);
      return () => clearInterval(interval);
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (token && isTokenValid === false) {
      handleLogout();
    }
  }, [isTokenValid, token]);

  return (
    <>
      <div className="min-h-screen bg-layout-bg p-10">
        <div className="flex justify-between items-center mb-8 relative">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Welcome Back {userInfo?.firstname || "Admin"}{" "}
            </h1>
            <p className="text-lore"></p>
          </div>

          <div className="flex items-center space-x-3">
            {token && isTokenValid && userInfo ? (
              <>
                {/* Avatar */}
                <div
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-10 h-10 bg-gradient-to-r from-sidebar-gradient-start to-sidebar-gradient-end text-white rounded-full flex items-center justify-center cursor-pointer"
                >
                  <span className="text-white font-semibold text-sm">
                    {userInfo?.firstname?.[0] || "A"}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {userInfo?.firstname} {userInfo?.lastname}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {userInfo?.role || "Admin"}
                  </p>
                </div>

                {menuOpen && (
                  <div className="absolute right-0 top-14 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {userInfo?.firstname} {userInfo?.lastname}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userInfo?.role || "Admin"}
                      </p>
                    </div>

                    {/* <button
                      onClick={() => router.push("/profile")}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      View Profile
                    </button> */}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-50 rounded-b-xl"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : isTokenValid === false ? (
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Login
              </button>
            ) : null}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                {/* <div className="w-4 h-4 bg-blue-500 rounded"></div> */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <Image
                    src="/icons/dashboard/product-icon.svg"
                    alt="Customer Icon"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <span className="text-dashboard font-medium">Products</span>
            </div>
            <p className="text-3xl font-bold text-text-primary">
              {" "}
              {productsCount}
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <Image
                    src="/icons/dashboard/orders-icon.svg"
                    alt="Customer Icon"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <span className="text-dashboard font-medium">Orders</span>
            </div>
            <p className="text-3xl font-bold text-text-primary">
              {" "}
              {ordersCount}
            </p>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Image
                  src="/icons/dashboard/profit-icon.svg"
                  alt="Revenue Icon"
                  width={20}
                  height={20}
                />
              </div>
              <span className="text-dashboard font-medium">Revenue</span>
            </div>
            <p className="text-3xl font-bold text-text-primary">
              ₹{revenue.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                {/* <div className="w-4 h-4 bg-purple-500 rounded"></div> */}

                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Image
                    src="/icons/dashboard/users-icon.svg"
                    alt="Customer Icon"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <span className="text-dashboard font-medium">Customer</span>
            </div>
            <p className="text-3xl font-bold text-text-primary">
              {" "}
              {customersCount}
            </p>
          </div>
        </div>
        <div>
          {/* <Orders /> */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Orders
                </h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => router.push("/dashboard/orders")}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                  >
                    See More
                  </button>
                </div>
              </div>

              {/* Orders list */}
              {recentOrders.length > 0 ? (
                <Orders
                  orders={recentOrders}
                  showViewIcon={true}
                  showHeader={false}
                  showStatus={false}
                  showTime={false}
                />
              ) : (
                <p className="text-gray-500">No recent orders found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
