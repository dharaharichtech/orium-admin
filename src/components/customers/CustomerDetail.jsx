"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getAllOrders } from "@/api/orderApi";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerById } from "@/redux/reducer/user/userSlice";

const CustomerDetail = ({ customerId }) => {
  const dispatch = useDispatch();
  const { customerDetail, loading } = useSelector((state) => state.user);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const API_BASE_URL = process.env.API_BASE_URL;

  useEffect(() => {
    if (customerId) {
      dispatch(fetchCustomerById(customerId));
    }
  }, [customerId, dispatch]);

  useEffect(() => {
    if (!customerId) return;
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await getAllOrders(1, 100);
        const userOrders = res.filter(
          (order) => order.user_id?._id === customerId
        );
        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [customerId]);

  if (loading || !customerDetail) return <p>Loading...</p>;

  const customer = customerDetail;

  const firstLetter = (
    customer.firstname?.charAt(0) ||
    customer.email?.charAt(0) ||
    "U"
  ).toUpperCase();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
            {customer.profileImage &&
            customer.profileImage.startsWith("http") ? (
              <Image
                src={customer.profileImage}
                alt={customer.firstname || customer.email}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-2xl font-bold text-gray-600">
                {firstLetter}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {customer.firstname || customer.email} {customer.lastname || ""}
            </h2>
            <p className="text-gray-500">{customer.email}</p>
            <p className="text-gray-500">{customer.phone}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-4 py-1 rounded-md text-sm font-medium ${
            customer.isBlocked
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {customer.isBlocked ? "Blocked" : "Active"}
        </span>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-3 gap-y-6 text-sm">
          <div>
            <p className="text-gray-500">Country</p>
            <p className="font-medium">{customer.country}</p>
          </div>
          <div>
            <p className="text-gray-500">State</p>
            <p className="font-medium">{customer.state}</p>
          </div>
          <div>
            <p className="text-gray-500">City</p>
            <p className="font-medium">{customer.city}</p>
          </div>
          <div>
            <p className="text-gray-500">Pincode</p>
            <p className="font-medium">{customer.pincode}</p>
          </div>
          <div>
            <p className="text-gray-500">Address</p>
            <p className="font-medium">{customer.address}</p>
          </div>
          <div>
            <p className="text-gray-500">Registration Date</p>
            <p className="font-medium">
              {new Date(customer.date).toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Purchase History</h3>
          {/* <div className="flex items-center space-x-2">
            <button className="border px-3 py-1 rounded-md text-sm text-gray-600">
              Select Date
            </button>
            <button className="border px-3 py-1 rounded-md text-sm text-gray-600">
              Filters
            </button>
          </div> */}
        </div>

        {loadingOrders ? (
          <p className="text-gray-500 text-sm">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 text-sm">No orders available yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-300">
              <thead className="bg-gray-50 border-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">Added</th>
                  <th className="px-4 py-2 text-center">Quantity</th>
                  <th className="px-4 py-2 text-center">Total</th>
                  <th className="px-4 py-2 text-center">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {orders
                  .filter((order) => order.product_id)
                  .map((order) => {
                    const product = order.product_id;
                    const imageUrl = product?.images?.[0]?.url
                      ? product.images[0].url.startsWith("http")
                        ? product.images[0].url
                        : `${API_BASE_URL}${product.images[0].url}`
                      : "/placeholder.png";

                    return (
                      <tr key={order._id}>
                        <td className="px-4 py-3 flex items-center gap-2">
                          <Image
                            src={imageUrl}
                            alt={product?.title || "No product"}
                            width={40}
                            height={40}
                            className="rounded"
                          />
                          <span className="font-medium">
                            {product?.title || "Unknown Product"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-GB"
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {order.quantity}
                        </td>
                        <td className="px-4 py-3 text-center">
                          ₹{order.amount}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-4 py-2 text-xs rounded font-medium ${
                              order.status === "Paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetail;
