"use client";

import {
  Calendar,
  Eye,
  Filter,
  Trash2,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  ChevronDown,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  updateOrderStatusAsync,
  updateOrderStatusThunk,
} from "@/redux/reducer/order/orderSlice";

const Orders = ({
  orders: propOrders,
  showViewIcon = true,
  showHeader = true,
  showStatus = true,
  showTime = true,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { orders, loading, error } = useSelector((state) => state.order);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTimeFilter, setActiveTimeFilter] = useState("All Date");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);
  const statusOptions = ["pending", "paid", "failed", "shipped"];

  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const handleViewClick = (order) => {
    router.push(`/dashboard/orders/${order._id}`);
  };

  const confirmDelete = () => {
    if (!selectedOrder) return;
    console.log("Deleting order:", selectedOrder._id);
    setShowDeleteModal(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    if (propOrders) return;
    dispatch(fetchOrders(1, 10));
  }, [dispatch, propOrders]);

  if (loading) return <p className="p-6">Loading orders...</p>;

  if (error) {
    return <p className="p-6 text-red-600">Error: {error}</p>;
  }

  const ordersToShow = propOrders || orders;

  const getFilteredOrders = () => {
    if (!ordersToShow || ordersToShow.length === 0) return [];

    const now = new Date();

    switch (activeTimeFilter) {
      case "All Date":
        console.log("Showing all orders");
        return ordersToShow;

      case "12 Months":
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setFullYear(now.getFullYear() - 1);
        const filtered12 = ordersToShow.filter((order) => {
          if (!order.createdAt) return false;
          const orderDate = new Date(order.createdAt);
          return orderDate >= twelveMonthsAgo;
        });
        // console.log("12 months filter - cutoff:", twelveMonthsAgo, "filtered count:", filtered12.length);
        return filtered12;

      case "30 Days":
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        const filtered30 = ordersToShow.filter((order) => {
          if (!order.createdAt) return false;
          const orderDate = new Date(order.createdAt);
          return orderDate >= thirtyDaysAgo;
        });
        // console.log("30 days filter - cutoff:", thirtyDaysAgo, "filtered count:", filtered30.length);
        return filtered30;

      case "7 Days":
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        const filtered7 = ordersToShow.filter((order) => {
          if (!order.createdAt) return false;
          const orderDate = new Date(order.createdAt);
          return orderDate >= sevenDaysAgo;
        });
        console.log(
          "7 days filter - cutoff:",
          sevenDaysAgo,
          "filtered count:",
          filtered7.length
        );
        return filtered7;

      case "24 Hour":
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setTime(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours in milliseconds
        const filtered24 = ordersToShow.filter((order) => {
          if (!order.createdAt) return false;
          const orderDate = new Date(order.createdAt);
          console.log(
            "Order date:",
            orderDate,
            "Cutoff:",
            twentyFourHoursAgo,
            "Is valid:",
            orderDate >= twentyFourHoursAgo
          );
          return orderDate >= twentyFourHoursAgo;
        });
        console.log(
          "24 hours filter - cutoff:",
          twentyFourHoursAgo,
          "filtered count:",
          filtered24.length
        );
        return filtered24;

      default:
        return ordersToShow;
    }
  };

  const filteredOrders = getFilteredOrders();

  const getOrderStats = () => {
    const stats = {
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    filteredOrders.forEach((order) => {
      switch (order.status?.toLowerCase()) {
        case "processing":
        case "pending":
          stats.processing++;
          break;
        case "shipped":
          stats.shipped++;
          break;
        case "delivered":
        case "paid":
          stats.delivered++;
          break;
        case "cancelled":
          stats.cancelled++;
          break;
        default:
          stats.processing++;
      }
    });

    return stats;
  };
  const stats = getOrderStats();

  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
      case "processing":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getAvailableStatusOptions = (currentStatus) => {
    const options = ["pending", "paid", "failed", "shipped", "cancelled"];
    return options.filter((status) => status !== currentStatus?.toLowerCase());
  };

  const toggleDropdown = (orderId) => {
    setDropdownOpen(dropdownOpen === orderId ? null : orderId);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const timeFilters = ["All Date", "12 Months", "30 Days", "7 Days", "24 Hour"];

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatusAsync(orderId, newStatus));
      setDropdownOpen(null);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <span
                  onClick={() => router.push("/dashboard")}
                  className="text-green-600 font-bold cursor-pointer"
                >
                  Dashboard
                </span>
                <span>
                  <Image
                    src="/icons/right-arrow.svg"
                    alt="arrow-right"
                    width={16}
                    height={16}
                  />
                </span>
                <span className="text-gray-900">Orders</span>
              </nav>
            </div>
          </div>
        </div>
      )}
      {showStatus && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Processing
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.processing.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Shipped */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Shipped
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.shipped.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Delivered
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.delivered.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Cancelled
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.cancelled.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {showTime && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {timeFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveTimeFilter(filter)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTimeFilter === filter
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-3">
              {/* <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Select Dates</span>
            </button> */}
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filters</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No orders found for the selected time period
                  </td>
                </tr>
              ) : (
                filteredOrders
                  .filter((order) => order.product_id)
                  .map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      {/* Product */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                            {order.product_id?.images?.length > 0 ? (
                              <Image
                                src={order.product_id.images[0].url}
                                alt={order.product_id.title}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-gray-500">📦</span>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.product_id?.title || "Unnamed Product"}
                            </div>
                            <div className="text-xs text-gray-500">
                              Order ID: {order.orderId}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.user_id?.firstname} {order.user_id?.lastname}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.user_id?.email}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.createdAt)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : ""}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.quantity}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{order.amount}
                        </div>
                      </td>

                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === "paid" || order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td> */}

                      {/* Status Dropdown */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative" ref={dropdownRef}>
                          <button
                            onClick={() => toggleDropdown(order._id)}
                            className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${getStatusClasses(
                              order.status
                            )}`}
                          >
                            {order.status}
                            <ChevronDown className="w-3 h-3 ml-1" />
                          </button>

                          {dropdownOpen === order._id && (
                            <div className="absolute z-10 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-100">
                              {getAvailableStatusOptions(order.status).map(
                                (status) => (
                                  <button
                                    key={status}
                                    onClick={() =>
                                      handleStatusChange(order._id, status)
                                    }
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    {status.charAt(0).toUpperCase() +
                                      status.slice(1)}
                                  </button>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          {showViewIcon && (
                            <button
                              onClick={() => handleViewClick(order)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {/* <button
                            onClick={() => handleDeleteClick(order)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowDeleteModal(false)}
            >
              <div className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              Delete Order
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Do you want to delete this order? This action can't be undone.
            </p>

            <div className="flex justify-between mt-6 space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
