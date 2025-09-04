"use client";
import Image from "next/image";
import React, { useState } from "react";
import Orders from "./Orders";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState("");

  return (
    <>
      <div className="min-h-screen bg-layout-bg p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Welcome Back Jay
            </h1>
            <p className="text-lore">
              Lorem ipsum dolor si amet welcome back johny
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">JH</span>
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                Jay Hargudson
              </p>
              <p className="text-xs text-text-secondary">Manager</p>
            </div>
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
            <p className="text-3xl font-bold text-text-primary">5</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                {/* <div className="w-4 h-4 bg-green-500 rounded"></div> */}
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
            <p className="text-3xl font-bold text-text-primary">31,500</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                {/* <div className="w-4 h-4 bg-red-500 rounded"></div> */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <Image
                    src="/icons/dashboard/profit-icon.svg"
                    alt="Customer Icon"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <span className="text-dashboard font-medium">Profit</span>
            </div>
            <p className="text-3xl font-bold text-text-primary">$51,250</p>
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
            <p className="text-3xl font-bold text-text-primary">11,300</p>
          </div>
        </div>
        <Orders />
      </div>
    </>
  );
}
