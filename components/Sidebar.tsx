"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaUsers,
  FaMoneyCheck,
  FaPiggyBank,
  FaChartLine,
  FaHandshake,
  FaFileInvoice,
} from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", icon: FaTachometerAlt, path: "/dashboard" },
  { name: "Employees", icon: FaUsers, path: "/dashboard/members" },
  { name: "Payroll", icon: FaMoneyCheck, path: "/dashboard/payroll" },
  { name: "Savings", icon: FaPiggyBank, path: "/dashboard/savings" },
  { name: "Loans", icon: FaHandshake, path: "/dashboard/loans" },
  { name: "Reports", icon: FaChartLine, path: "/dashboard/reports" },
  { name: "Contracts", icon: FaFileInvoice, path: "/dashboard/contracts" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white text-gray-800 flex flex-col rounded-xl shadow-lg font-sans">
      {/* Logo */}
      <div className="px-6 py-4 font-bold text-2xl text-green-600 border-b border-gray-200">
        Thoth HR
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
                isActive
                  ? "bg-green-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-green-100 hover:text-green-600"
              }`}
            >
              <Icon className="mr-3 text-lg" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
