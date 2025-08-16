"use client";

import { useState } from "react";
import { useStore, Payroll as PayrollType, Member } from "@/lib/store";

export default function PayrollPage() {
  const {
    getPayrolls,
    getMembers,
    addPayroll,
    deletePayroll,
    markPayrollAsPaid,
  } = useStore();

  const payrolls = getPayrolls();
  const members = getMembers();

  // Form states
  const [employeeId, setEmployeeId] = useState("");
  const [salary, setSalary] = useState("");
  const [status, setStatus] = useState<"Paid" | "Pending">("Pending");

  // Search and sorting
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof PayrollType>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Add Payroll
  const handleAddPayroll = () => {
    if (!employeeId || !salary) return;

    addPayroll({
      memberId: employeeId,
      salary: parseFloat(salary),
    });

    setEmployeeId("");
    setSalary("");
    setStatus("Pending");
  };

  const handleMarkAsPaid = (id: string) => markPayrollAsPaid(id);
  const handleDeletePayroll = (id: string) => deletePayroll(id);

  const toggleSort = (key: keyof PayrollType) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredPayrolls = [...payrolls]
    .filter((p) => {
      const member = members.find((m) => m.id === p.memberId);
      return (
        member?.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.status ?? "Pending").toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      let valA: string | number = "";
      let valB: string | number = "";

      switch (sortKey) {
        case "memberId":
          valA = members.find((m) => m.id === a.memberId)?.name ?? "";
          valB = members.find((m) => m.id === b.memberId)?.name ?? "";
          break;
        case "status":
          valA = a.status ?? "Pending";
          valB = b.status ?? "Pending";
          break;
        case "salary":
          valA = a.salary ?? 0;
          valB = b.salary ?? 0;
          break;
        case "date":
          valA = a.date ?? "";
          valB = b.date ?? "";
          break;
        default:
          valA = (a[sortKey] as string) ?? "";
          valB = (b[sortKey] as string) ?? "";
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }

      return sortOrder === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

  const paginatedPayrolls = filteredPayrolls.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredPayrolls.length / rowsPerPage);

  const totalPayrollAmount = payrolls.reduce(
    (sum, p) => sum + (p.salary ?? 0),
    0
  );

  return (
    <div className="p-6 max-w-6xl mx-auto text-black">
      <h1 className="text-3xl font-bold mb-6">Payroll</h1>

      {/* Add Payroll Form */}
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        >
          <option value="">Select Employee</option>
          {members.map((m: Member) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "Paid" | "Pending")}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>

        <button
          onClick={handleAddPayroll}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition"
        >
          Add Payroll
        </button>
      </div>

      {/* Search + Total */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Search employees or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        />
        <div className="font-semibold text-lg">
          Total Payroll: KSh {totalPayrollAmount.toLocaleString()}
        </div>
      </div>

      {/* Payroll Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {["Employee", "Salary", "Status", "Actions"].map((col, i) => (
                <th
                  key={i}
                  className="p-2 text-left cursor-pointer"
                  onClick={() => {
                    if (col === "Employee") toggleSort("memberId");
                    else if (col === "Status") toggleSort("status");
                    else if (col === "Salary") toggleSort("salary");
                    else toggleSort("date");
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedPayrolls.map((p) => {
              const member = members.find((m) => m.id === p.memberId);
              return (
                <tr
                  key={p.id}
                  className="border-b even:bg-gray-50 hover:bg-gray-100 transition"
                >
                  <td className="p-2">{member?.name ?? "Unknown"}</td>
                  <td className="p-2">KSh {(p.salary ?? 0).toLocaleString()}</td>
                  <td className="p-2">{p.status ?? "Pending"}</td>
                  <td className="p-2 flex gap-2">
                    {p.status !== "Paid" && (
                      <button
                        onClick={() => handleMarkAsPaid(p.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        Mark as Paid
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletePayroll(p.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}


