"use client";

import Customers from "@/components/customers/Customers";
import Dashboard from "@/components/dashboard/Dashboard";
import Orders from "@/components/orders/Orders";
import Product from "@/components/products/Product";
import Sidebar from "@/components/sidebar/Sidebar";
import React, { useState } from "react";

const Page = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "product":
        return <Product />;
      case "orders":
        return <Orders />;
      case "customer":
        return <Customers />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white shadow-sm">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>

      <main className="flex-1 bg-layout-bg">
        {renderContent()}
      </main>
    </div>
  );
};

export default Page;
