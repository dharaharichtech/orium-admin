import Link from "next/link";
import Image from "next/image";

const routes = [
  { label: "Dashboard", href: "/dashboard", icon: "/icons/dashboard.svg" },
  { label: "Product", href: "/product", icon: "/icons/product.svg" },
  { label: "Orders", href: "/orders", icon: "/icons/orders.svg" },
  { label: "Customer", href: "/customer", icon: "/icons/customer.svg" },
  { label: "Contact", href: "/contact", icon: "/icons/contact.svg" },
];

export default function Sidebar() {
  return (
    <div className="w-60 bg-white border-r h-screen p-4">
      <nav className="space-y-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-text hover:bg-sidebar-gradientStart hover:text-white"
          >
            <Image src={route.icon} alt={route.label} width={18} height={18} />
            <span className="font-medium">{route.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
