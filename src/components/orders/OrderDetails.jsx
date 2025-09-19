"use client";

import React, { useEffect } from "react";
import { Package, Calendar, DollarSign, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderById,
  clearOrderDetail,
} from "@/redux/reducer/order/orderSlice";
import { fetchCustomerById } from "@/redux/reducer/user/userSlice";

const OrderDetails = ({ OrderId }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    orderDetail,
    loading: orderLoading,
    error: orderError,
  } = useSelector((state) => state.order);
  const { customerDetail, loading: userLoading } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (OrderId) {
      dispatch(fetchOrderById(OrderId));
    }

    return () => {
      dispatch(clearOrderDetail());
    };
  }, [dispatch, OrderId]);

  useEffect(() => {
    if (orderDetail?.user_id && typeof orderDetail.user_id === "string") {
      dispatch(fetchCustomerById(orderDetail.user_id));
    }
  }, [dispatch, orderDetail?.user_id]);

  if (orderLoading || userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg">Loading order details...</p>
      </div>
    );
  }

  if (orderError || !orderDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">
            {orderError || "Order not found"}
          </p>
          <button
            onClick={() => router.push("/dashboard/orders")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const order = orderDetail;
  const customer = customerDetail;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Order #{order.orderId}
                </h1>
                <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
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
                  <span
                    onClick={() => router.push("/dashboard/orders")}
                    className="text-green-600 font-bold cursor-pointer"
                  >
                    Orders
                  </span>
                  <span>
                    <Image
                      src="/icons/right-arrow.svg"
                      alt="arrow-right"
                      width={16}
                      height={16}
                    />
                  </span>
                  <span className="text-gray-900">Order Details</span>
                </nav>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                <Image
                  src="/icons/orders/export.svg"
                  alt="export"
                  width={16}
                  height={16}
                />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Product Details */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Product
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 text-sm font-medium text-gray-700">
                          Product
                        </th>
                        <th className="text-left py-3 text-sm font-medium text-gray-700">
                          Quantity
                        </th>
                        <th className="text-left py-3 text-sm font-medium text-gray-700">
                          Price
                        </th>
                        <th className="text-right py-3 text-sm font-medium text-gray-700">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
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
                                <Package size={20} className="text-gray-400" />
                              )}
                            </div>
                            <span className="text-sm text-gray-900">
                              {order.product_id?.title ||
                                "Product Not Available"}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 text-sm text-gray-600">
                          {order.quantity}
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          ₹
                          {order.product_id?.price ||
                            order.amount / order.quantity}
                        </td>
                        <td className="py-4 text-sm text-gray-900 text-right font-medium">
                          ₹{order.amount}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-gray-200 mt-6 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">₹{order.amount - 5}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">GST (0%)</span>
                      <span className="text-gray-900">₹0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping Rate</span>
                      <span className="text-gray-900">₹5.00</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                      <span className="text-gray-900">Grand Total</span>
                      <span className="text-gray-900">₹{order.amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Image
                    src="/icons/orders/ship-address.svg"
                    alt="shipping address"
                    width={32}
                    height={32}
                  />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Shipping Address
                  </h3>
                </div>
                <div className="flex items-start gap-3">
                  <Image
                    src="/icons/orders/address.svg"
                    alt="address"
                    width={16}
                    height={16}
                  />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900">
                      {customer?.firstname} {customer?.lastname}
                    </p>
                    <p>
                      {customer?.address}, {customer?.city}, {customer?.state}
                    </p>
                    <p>
                      {customer?.pincode} - {customer?.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/icons/orders/info-icon.svg"
                  alt="info"
                  width={32}
                  height={32}
                />
                <h3 className="text-lg font-semibold text-gray-900">
                  General Information
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Image
                    src="/icons/orders/order-status.svg"
                    alt="status"
                    width={16}
                    height={16}
                  />
                  <div>
                    <p className="text-sm text-gray-600">Order Status</p>
                    <p className="text-sm font-medium text-gray-900">
                      {order.status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Image
                    src="/icons/orders/customer.svg"
                    alt="customer"
                    width={16}
                    height={16}
                  />
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="text-sm font-medium text-gray-900">
                      {customer?.firstname} {customer?.lastname}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Image
                    src="/icons/orders/email.svg"
                    alt="email"
                    width={16}
                    height={16}
                  />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-sm font-medium text-gray-900">
                      {customer?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Image
                    src="/icons/orders/phn.svg"
                    alt="phone"
                    width={16}
                    height={16}
                  />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="text-sm font-medium text-gray-900">
                      {customer?.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/icons/orders/payment.svg"
                  alt="payment"
                  width={32}
                  height={32}
                />
                <h3 className="text-lg font-semibold text-gray-900">Payment</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Transaction ID</p>
                    <p className="text-sm font-medium text-gray-900">
                      {order.paymentInfo?.txnId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Image
                    src="/icons/orders/pay-method.svg"
                    alt="payment method"
                    width={16}
                    height={16}
                  />
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="text-sm font-medium text-gray-900">
                      {order.paymentInfo?.method}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/icons/orders/shipping.svg"
                  alt="shipping"
                  width={32}
                  height={32}
                />
                <h3 className="text-lg font-semibold text-gray-900">
                  Shipping
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Package size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Shipping ID</p>
                    <p className="text-sm font-medium text-gray-900">
                      SP{order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Image
                    src="/icons/orders/ship-method.svg"
                    alt="shipping method"
                    width={16}
                    height={16}
                  />
                  <div>
                    <p className="text-sm text-gray-600">Shipping Method</p>
                    <p className="text-sm font-medium text-gray-900">Regular</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
