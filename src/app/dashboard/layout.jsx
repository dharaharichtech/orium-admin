"use client";
import Sidebar from "@/components/sidebar/Sidebar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const activeTab = pathname.split("/")[2] || "dashboard";

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white shadow-sm">
        <Sidebar activeTab={activeTab} />
      </aside>

      <main className="flex-1 bg-layout-bg p-6">
        {children}
      </main>
    </div>
  );
}
