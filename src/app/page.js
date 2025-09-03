import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import Dashboard from "../components/dashboard/Dashboard";

const Page = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-layoutBg p-6">
        <Dashboard />
      </main>
    </div>
  );
};

export default Page;
