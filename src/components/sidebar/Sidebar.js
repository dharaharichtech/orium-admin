"use client";
import Image from "next/image";

const routes = [
  { 
    label: "Dashboard", 
    key: "dashboard", 
    icon: { default: "/icons/sidebar/dash-gray.svg", active: "/icons/sidebar/dash-white.svg" }
  },
  { 
    label: "Product", 
    key: "product", 
    icon: { default: "/icons/sidebar/pro-gray.svg", active: "/icons/sidebar/pro-white.svg" }
  },
  { 
    label: "Orders", 
    key: "orders", 
    icon: { default: "/icons/sidebar/orders-gray.svg", active: "/icons/sidebar/orders-white.svg" }
  },
  { 
    label: "Customer", 
    key: "customer", 
    icon: { default: "/icons/sidebar/users-gray.svg", active: "/icons/sidebar/users-white.svg" }
  },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-60 bg-white h-screen p-6 flex flex-col">
      <div className="mb-10">
        <Image
          src="/icons/sidebar/logo.svg"
          alt="Orium Logo"
          width={120}
          height={40}
          priority
        />
      </div>

      <nav className="space-y-2">
        {routes.map((route) => {
          const isActive = activeTab === route.key;

          return (
            <button
              key={route.key}
              onClick={() => setActiveTab(route.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-medium transition text-left
                ${
                  isActive
                    ? "bg-gradient-to-r from-sidebar-gradient-start to-sidebar-gradient-end text-white"
                    : "text-sidebar-text hover:bg-gradient-to-r hover:from-sidebar-gradient-start hover:to-sidebar-gradient-end hover:text-white"
                }`}
            >
              <Image
                src={isActive ? route.icon.active : route.icon.default}
                alt={route.label}
                width={20}
                height={20}
              />
              <span>{route.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
