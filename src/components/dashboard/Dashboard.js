"use client";
import React, { useState } from "react";
import { Eye, Trash2, Calendar, Filter } from "lucide-react";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState("");
  
  const orders = [
    {
      id: 1,
      product: "Handmade Pouch",
      productImage: "🎒",
      otherProducts: 3,
      customer: "John Bushmill",
      email: "john@email.com",
      total: "$121.00",
      status: "Processing",
      statusColor: "bg-orange-100 text-orange-800"
    },
    {
      id: 2,
      product: "Smartwatch E2",
      productImage: "⌚",
      otherProducts: 1,
      customer: "Ilham Budi Agung",
      email: "ilambudi@email.com",
      total: "$590.00",
      status: "Processing",
      statusColor: "bg-orange-100 text-orange-800"
    },
    {
      id: 3,
      product: "Smartwatch E1",
      productImage: "⌚",
      otherProducts: 0,
      customer: "Mohammad Karim",
      email: "m_karim@email.com",
      total: "$125.00",
      status: "Shipped",
      statusColor: "bg-blue-100 text-blue-800"
    },
    {
      id: 4,
      product: "Headphone G1 Pro",
      productImage: "🎧",
      otherProducts: 1,
      customer: "Linda Blair",
      email: "lindablair@email.com",
      total: "$348.00",
      status: "Shipped",
      statusColor: "bg-blue-100 text-blue-800"
    },
    {
      id: 5,
      product: "Iphone X",
      productImage: "📱",
      otherProducts: 0,
      customer: "Josh Adam",
      email: "josh_adam@email.com",
      total: "$607.00",
      status: "Delivered",
      statusColor: "bg-green-100 text-green-800"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back Jay</h1>
          <p className="text-gray-500">Lorem ipsum dolor si amet welcome back johny</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">JH</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Jay Hargudson</p>
            <p className="text-xs text-gray-500">Manager</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
            </div>
            <span className="text-gray-600 font-medium">Products</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">5</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
            </div>
            <span className="text-gray-600 font-medium">Orders</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">31,500</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
            </div>
            <span className="text-gray-600 font-medium">Profit</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">$51,250</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
            </div>
            <span className="text-gray-600 font-medium">Customer</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">11,300</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Select Date</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Filters</span>
              </button>
              <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                See More
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white text-lg">
                        {order.productImage}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.product}</div>
                        {order.otherProducts > 0 && (
                          <div className="text-xs text-gray-500">+{order.otherProducts} other products</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.total}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}