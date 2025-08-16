"use client";

// ============================
// ==== IMPORTS ===============
// ============================

import { useEffect, useState } from "react";

// Heroicons for dashboard stats
import {
  UserGroupIcon,
  UserMinusIcon,
  UserPlusIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

// Chart.js components
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Import Zustand store and types
import { useStore, Member, Loan, Saving, Payroll } from "@/lib/store";

// ============================
// ==== REGISTER CHART.JS ====
// ============================

// Register Chart.js components globally
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// ============================
// ==== DASHBOARD COMPONENT ====
// ============================

export default function DashboardPage() {
  // Access state and getters from Zustand store
  const { getMembers, getLoans, getSavings, getPayrolls } = useStore();

  // Local component state to hold store data
  const [members, setMembers] = useState<Member[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [savings, setSavings] = useState<Saving[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);

  // Fetch data from store on component mount
  useEffect(() => {
    setMembers(getMembers());
    setLoans(getLoans());
    setSavings(getSavings());
    setPayrolls(getPayrolls());
  }, [getMembers, getLoans, getSavings, getPayrolls]);

  // ============================
  // ==== DYNAMIC STATISTICS ====
  // ============================

  const stats = {
    headcount: members.length, // Total number of members
    leavers: members.filter((m) => m.status === "Terminated").length, // Members who left
    joiners: members.filter((m) => m.status === "Active").length, // Active members
    contractors: members.filter((m) => m.position?.toLowerCase() === "contractor").length, // Contractors
  };

  // ============================
  // ==== CHART DATA ============
  // ============================

  // Loan amounts per member for Bar chart
  const loanData = {
    labels: members.map((m) => m.name), // Member names on x-axis
    datasets: [
      {
        label: "Loan Amounts",
        data: members.map((m) =>
          loans
            .filter((l) => l.memberId === m.id) // Filter loans for this member
            .reduce((sum, l) => sum + l.amount, 0) // Sum all loans
        ),
        backgroundColor: "rgba(34,197,94,0.7)", // Bar color
      },
    ],
  };

  // Payroll status distribution for Pie chart
  const payrollData = {
    labels: ["Paid", "Pending"],
    datasets: [
      {
        data: [
          payrolls.filter((p) => p.status === "Paid").length,
          payrolls.filter((p) => p.status === "Pending").length,
        ],
        backgroundColor: ["#10B981", "#F59E0B"], // Green for Paid, Orange for Pending
      },
    ],
  };

  // ============================
  // ==== JSX RENDER ============
  // ============================

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Header section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<UserGroupIcon className="w-8 h-8 text-green-600" />}
          label="Headcount"
          value={stats.headcount}
          change={`${stats.joiners} new this month`}
        />
        <StatCard
          icon={<UserMinusIcon className="w-8 h-8 text-red-500" />}
          label="Leavers"
          value={stats.leavers}
          change="This month"
        />
        <StatCard
          icon={<UserPlusIcon className="w-8 h-8 text-blue-500" />}
          label="Joiners"
          value={stats.joiners}
          change="This month"
        />
        <StatCard
          icon={<BriefcaseIcon className="w-8 h-8 text-yellow-500" />}
          label="Contractors"
          value={stats.contractors}
          change="Currently active"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Loans Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-green-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Loans Overview</h2>
          <Bar data={loanData} />
        </div>

        {/* Payroll Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-green-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Payroll Status</h2>
          <Pie data={payrollData} />
        </div>
      </div>

      {/* Recent Savings List */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-green-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Savings</h2>
        <ul className="divide-y divide-gray-200">
          {savings.slice(-5).map((s) => {
            const member = members.find((m) => m.id === s.memberId); // Find member for this saving
            return (
              <li key={s.id} className="py-2 flex justify-between">
                <span>{member?.name || "Unknown"}</span>
                <span className="font-medium text-green-600">KSh {s.amount.toLocaleString()}</span>
              </li>
            );
          })}
          {savings.length === 0 && <li className="text-gray-500 py-2">No savings yet</li>}
        </ul>
      </div>
    </div>
  );
}

// ============================
// ==== STAT CARD COMPONENT ====
// ============================

// Reusable card component for displaying a statistic
function StatCard({
  icon,
  label,
  value,
  change,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  change: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 border border-green-100">
      {/* Icon section */}
      <div className="flex-shrink-0">{icon}</div>

      {/* Text content */}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400">{change}</p>
      </div>
    </div>
  );
}
