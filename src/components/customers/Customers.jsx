"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, Plus, Filter, Calendar, Eye, Pencil } from "lucide-react";
import Image from "next/image";
import CustomerDetail from "./CustomerDetail";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomers,
  updateCustomerStatus,
} from "@/redux/reducer/user/userSlice";

const Customers = () => {
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openPopup, setOpenPopup] = useState(null);
  const [openCustomerId, setOpenCustomerId] = useState(null);
  const popupRef = useRef(null);
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [search, setSearch] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const dispatch = useDispatch();
  const { customers, loading, total } = useSelector((state) => state.user);
  const [filterBy, setFilterBy] = useState("all");

  useEffect(() => {
    dispatch(fetchCustomers({ page, limit, search, filterBy }));
  }, [page, search, filterBy, dispatch]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map((c) => c._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectCustomer = (id) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter((cid) => cid !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  const handleOpenPopup = (customerId) => {
    setOpenPopup(openPopup === customerId ? null : customerId);
  };

  // const handleStatusChange = (id, newStatus) => {
  //   setCustomers((prev) =>
  //     prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
  //   );
  //   setOpenPopup(null);

  //   if (openCustomerId === id) {
  //     setOpenCustomerId(null);
  //     setTimeout(() => setOpenCustomerId(id), 0);
  //   }
  // };

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateCustomerStatus({ id, status: newStatus }));
    setOpenPopup(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpenPopup(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getStatusColor = (status) => {
    if (status === "Active")
      return "bg-green-100 text-green-700 border-green-200";
    if (status === "Blocked") return "bg-red-100 text-red-700 border-red-200";
    if (status === "Deactive")
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Customer</h1>
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
          <span className="text-gray-900">Customer</span>
        </nav>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={filterBy}
              onChange={(e) => {
                setPage(1);
                setFilterBy(e.target.value);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Default</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="date">Latest Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Customer ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Customer Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Address
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Added On
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    Loading...
                  </td>
                </tr>
              ) : customers.length > 0 ? (
                customers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer._id)}
                        onChange={() => handleSelectCustomer(customer._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {customer.uid}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        {/* <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {customer.avatar}
                        </div> */}

                        {/* <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-200"> */}
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                          {customer.avatar &&
                          customer.avatar.startsWith("http") ? (
                            <Image
                              src={customer.avatar}
                              alt={customer.name}
                              width={32}
                              height={32}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-600">
                              {customer.avatar}
                            </span>
                          )}
                        </div>

                        <span className="text-sm font-medium text-gray-900">
                          {customer.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {customer.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {customer.phone}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                      {customer.address}
                    </td>
                    <td className="px-4 py-3 relative">
                      <div
                        className={`inline-flex items-center justify-between px-2 py-1 text-xs font-medium rounded-md border min-w-[90px] text-center gap-1 ${getStatusColor(
                          customer.status
                        )}`}
                      >
                        <span>{customer.status}</span>
                        <button
                          onClick={() => handleOpenPopup(customer._id)}
                          className="p-0.5 rounded"
                        >
                          <Pencil
                            size={12}
                            className={
                              customer.status === "Active"
                                ? "text-green-600"
                                : customer.status === "Blocked"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }
                          />
                        </button>
                      </div>

                      {/* Status popup */}
                      {openPopup === customer._id && (
                        <div
                          ref={popupRef}
                          className="absolute bottom-full -mb-10 right-0 bg-white border border-gray-200 rounded-lg shadow-lg w-40 z-20 overflow-hidden"
                        >
                          {["Active", "Blocked", "Deactive"]
                            .filter((status) => status !== customer.status)
                            .map((status) => (
                              <button
                                key={status}
                                onClick={() =>
                                  handleStatusChange(customer._id, status)
                                }
                                className={`flex items-center w-full px-4 py-2 text-sm transition-colors
                                ${
                                  status === "Active"
                                    ? "text-green-600 hover:bg-green-50"
                                    : ""
                                }
                                ${
                                  status === "Blocked"
                                    ? "text-red-600 hover:bg-red-50"
                                    : ""
                                }
                                ${
                                  status === "Deactive"
                                    ? "text-yellow-600 hover:bg-yellow-50"
                                    : ""
                                }
                               `}
                              >
                                {status}
                              </button>
                            ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {customer.added}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        // onClick={() => setOpenCustomerId(customer._id)}
                        onClick={() =>
                          router.push(`/dashboard/customers/${customer._id}`)
                        }
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Eye size={16} className="text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center text-gray-500 py-6 text-sm"
                  >
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)}{" "}
            of {total}
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              ← Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 text-sm rounded ${
                  page === i + 1
                    ? "bg-blue-500 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
