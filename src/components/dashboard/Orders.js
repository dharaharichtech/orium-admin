import { Calendar, Eye, Filter, Trash2 } from 'lucide-react';
import React from 'react'

const Orders = () => {

     const orders = [
    {
      id: 1,
      product: "Handmade Pouch",
      productImage: "🎒",
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
      customer: "Josh Adam",
      email: "josh_adam@email.com",
      total: "$607.00",
      status: "Delivered",
      statusColor: "bg-green-100 text-green-800"
    }
  ];


  return (
    <div>

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
  )
}

export default Orders
