"use client";

import { useEffect, useState } from "react";
import { useStore, Loan, Payroll, Member } from "@/lib/store";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function ReportsPage() {
  const { getLoans, getPayrolls, getMembers } = useStore();

  const [loans, setLoans] = useState<Loan[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [loanFilter, setLoanFilter] = useState<"All" | "Active" | "Repaid" | "Defaulted" | "Pending">("All");
  const [payrollFilter, setPayrollFilter] = useState<"All" | "Paid" | "Pending">("All");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    setLoans(getLoans());
    setPayrolls(getPayrolls());
    setMembers(getMembers());
  }, []);

  // Filtered Members for Table & Charts
  const filteredMembers = members.filter((m) => {
    const memberLoans = loans.filter((l) => l.memberId === m.id);
    const memberPayrolls = payrolls.filter((p) => p.memberId === m.id);

    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesLoanFilter =
      loanFilter === "All" || memberLoans.some((l) => l.status === loanFilter);
    const matchesPayrollFilter =
      payrollFilter === "All" || memberPayrolls.some((p) => p.status === payrollFilter);

    const inDateRange =
      (!startDate || memberLoans.some((l) => dayjs(l.date).isAfter(dayjs(startDate)))) &&
      (!endDate || memberLoans.some((l) => dayjs(l.date).isBefore(dayjs(endDate))));

    return matchesSearch && matchesLoanFilter && matchesPayrollFilter && inDateRange;
  });

  // Summary Stats
  const totalLoans = loans.reduce((sum, l) => sum + l.amount, 0);
  const totalPayrolls = payrolls.reduce((sum, p) => sum + p.salary, 0);
  const averageLoan = loans.length ? totalLoans / loans.length : 0;
  const averagePayroll = payrolls.length ? totalPayrolls / payrolls.length : 0;
  const activeLoansCount = loans.filter((l) => l.status === "Active").length;
  const pendingPayrollsCount = payrolls.filter((p) => p.status === "Pending").length;

  // Chart Data
  const loanAmountsData = {
    labels: filteredMembers.map((m) => m.name),
    datasets: [
      {
        label: "Total Loan Amount",
        data: filteredMembers.map(
          (m) => loans.filter((l) => l.memberId === m.id).reduce((sum, l) => sum + l.amount, 0)
        ),
        backgroundColor: "rgba(34,197,94,0.7)",
      },
    ],
  };

  const loanStatusData = {
    labels: ["Active", "Repaid", "Defaulted", "Pending"],
    datasets: [
      {
        label: "Loan Status",
        data: [
          loans.filter((l) => l.status === "Active").length,
          loans.filter((l) => l.status === "Repaid").length,
          loans.filter((l) => l.status === "Defaulted").length,
          loans.filter((l) => l.status === "Pending").length,
        ],
        backgroundColor: ["#22c55e", "#3b82f6", "#ef4444", "#facc15"],
      },
    ],
  };

  const payrollTrendData = {
    labels: Array.from({ length: 12 }, (_, i) => dayjs().month(i).format("MMM")),
    datasets: [
      {
        label: "Payroll Paid",
        data: Array.from({ length: 12 }, (_, i) =>
          payrolls
            .filter((p) => dayjs(p.date).month() === i)
            .reduce((sum, p) => sum + p.salary, 0)
        ),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.3)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Export CSV
  const exportCSV = () => {
    const header = ["Member", "Total Loans", "Total Payroll Paid"];
    const rows = filteredMembers.map((m) => {
      const totalLoan = loans.filter((l) => l.memberId === m.id).reduce((sum, l) => sum + l.amount, 0);
      const totalPayroll = payrolls.filter((p) => p.memberId === m.id).reduce((sum, p) => sum + p.salary, 0);
      return [m.name, totalLoan, totalPayroll];
    });
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Payroll & Loan Reports</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search member..."
          className="border p-2 rounded flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={loanFilter}
          onChange={(e) => setLoanFilter(e.target.value as any)}
          className="border p-2 rounded"
        >
          <option value="All">All Loan Status</option>
          <option value="Active">Active</option>
          <option value="Repaid">Repaid</option>
          <option value="Defaulted">Defaulted</option>
          <option value="Pending">Pending</option>
        </select>
        <select
          value={payrollFilter}
          onChange={(e) => setPayrollFilter(e.target.value as any)}
          className="border p-2 rounded"
        >
          <option value="All">All Payroll Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={exportCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Total Loans</h2>
          <p className="text-2xl font-bold text-green-600">KSh {totalLoans.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Total Payroll Paid</h2>
          <p className="text-2xl font-bold text-blue-600">KSh {totalPayrolls.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Active Loans / Pending Payrolls</h2>
          <p className="text-2xl font-bold text-yellow-600">
            {activeLoansCount} / {pendingPayrollsCount}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Loan Amounts per Member</h3>
          <Bar data={loanAmountsData} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Loan Status Distribution</h3>
          <Pie data={loanStatusData} />
        </div>
        <div className="bg-white p-4 rounded shadow md:col-span-2">
          <h3 className="text-lg font-semibold mb-2">Payroll Trend (Monthly)</h3>
          <Line data={payrollTrendData} />
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <h3 className="text-lg font-semibold mb-2">Member Details</h3>
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left border">Member</th>
              <th className="p-2 text-left border">Total Loans</th>
              <th className="p-2 text-left border">Total Payroll Paid</th>
              <th className="p-2 text-left border">Active Loans</th>
              <th className="p-2 text-left border">Pending Payrolls</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((m) => {
              const totalLoan = loans.filter((l) => l.memberId === m.id).reduce((sum, l) => sum + l.amount, 0);
              const totalPayroll = payrolls.filter((p) => p.memberId === m.id).reduce((sum, p) => sum + p.salary, 0);
              const activeLoans = loans.filter((l) => l.memberId === m.id && l.status === "Active").length;
              const pendingPayrolls = payrolls.filter((p) => p.memberId === m.id && p.status === "Pending").length;

              return (
                <tr key={m.id} className="hover:bg-gray-50 transition">
                  <td className="p-2 border">{m.name}</td>
                  <td className="p-2 border">KSh {totalLoan.toLocaleString()}</td>
                  <td className="p-2 border">KSh {totalPayroll.toLocaleString()}</td>
                  <td className="p-2 border text-green-600 font-semibold">{activeLoans}</td>
                  <td className="p-2 border text-yellow-600 font-semibold">{pendingPayrolls}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


