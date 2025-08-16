"use client";

import { usePathname } from "next/navigation";
import { FaBell, FaUserCircle } from "react-icons/fa";

// Map route path to page name
const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/members": "Employees",
  "/dashboard/payroll": "Payroll",
  "/dashboard/savings": "Savings",
  "/dashboard/loans": "Loans",
  "/dashboard/reports": "Reports",
  "/dashboard/contracts": "Contracts",
};

export default function Topbar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Dashboard";

  return (
    <div className="flex items-center justify-between bg-white text-gray-800 px-6 py-3 rounded-xl shadow-md font-sans">
      {/* Page title */}
      <h1 className="text-xl font-semibold text-green-600">{title}</h1>

      {/* Right section */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative hover:text-green-600 transition duration-300">
          <FaBell size={20} />
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </button>

        {/* User Profile */}
        <button className="flex items-center gap-2 hover:text-green-600 transition duration-300">
          <FaUserCircle size={28} />
          <span className="text-sm font-medium">Lee Kamau</span>
        </button>
      </div>
    </div>
  );
}
