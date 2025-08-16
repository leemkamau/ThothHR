"use client";
import React, { useState, useMemo } from "react";
import { useStore, LoanStatus } from "@/lib/store";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LoanManagement = () => {
  const { getLoans, getMembers, addLoan, updateLoan, deleteLoan } = useStore();
  const members = getMembers();
  const loans = getLoans();

  // Form state for adding new loan
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [repaymentTerm, setRepaymentTerm] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [status, setStatus] = useState<LoanStatus>("Pending");

  // Table controls
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof typeof loans[0]>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<LoanStatus | "All">("All");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Editing state
  const [editingLoanId, setEditingLoanId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    memberId: "",
    amount: "",
    date: "",
    repaymentTerm: "",
    interestRate: "",
    status: "Pending" as LoanStatus,
  });

  // Add Loan
  const handleAddLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !amount || !date || !repaymentTerm || !interestRate) {
      alert("Please fill all fields");
      return;
    }

    addLoan({
      memberId,
      amount: parseFloat(amount),
      date,
      repaymentTerm,
      interestRate: parseFloat(interestRate),
      status,
    });

    setMemberId(""); setAmount(""); setDate(""); setRepaymentTerm(""); setInterestRate(""); setStatus("Pending");
  };

  // Sorting & Filtering
  const filteredSortedLoans = useMemo(() => {
    return [...loans]
      .filter((loan) => {
        const memberName = members.find((m) => m.id === loan.memberId)?.name || "";
        const matchesSearch = memberName.toLowerCase().includes(search.toLowerCase()) || (loan.status || "").toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === "All" ? true : loan.status === filterStatus;
        const matchesDate = (!dateRange.start || loan.date >= dateRange.start) && (!dateRange.end || loan.date <= dateRange.end);
        return matchesSearch && matchesStatus && matchesDate;
      })
      .sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (typeof valA === "number" && typeof valB === "number") return sortOrder === "asc" ? valA - valB : valB - valA;
        return sortOrder === "asc" ? String(valA || "").localeCompare(String(valB || "")) : String(valB || "").localeCompare(String(valA || ""));
      });
  }, [loans, search, sortKey, sortOrder, members, filterStatus, dateRange]);

  const toggleSort = (key: keyof typeof loans[0]) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortOrder("asc"); }
  };

  const statusColor = (status: LoanStatus) => {
    switch (status) {
      case "Repaid": return "bg-green-500";
      case "Defaulted": return "bg-red-500";
      case "Pending": return "bg-yellow-500";
      default: return "bg-blue-500"; // Active
    }
  };

  // Editing functions
  const startEditing = (loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;
    setEditingLoanId(loanId);
    setEditData({
      memberId: loan.memberId,
      amount: loan.amount.toString(),
      date: loan.date,
      repaymentTerm: loan.repaymentTerm,
      interestRate: loan.interestRate.toString(),
      status: loan.status,
    });
  };
  const saveEdit = (loanId: string) => {
    updateLoan(loanId, {
      memberId: editData.memberId,
      amount: parseFloat(editData.amount),
      date: editData.date,
      repaymentTerm: editData.repaymentTerm,
      interestRate: parseFloat(editData.interestRate),
      status: editData.status,
    });
    setEditingLoanId(null);
  };
  const cancelEdit = () => setEditingLoanId(null);

  // Loan summary chart
  const loanSummary = useMemo(() => {
    const summary: Record<LoanStatus, number> = { Active: 0, Pending: 0, Repaid: 0, Defaulted: 0 };
    loans.forEach(loan => { summary[loan.status || "Pending"] += 1; });
    return summary;
  }, [loans]);

  const chartData = {
    labels: Object.keys(loanSummary),
    datasets: [{
      label: "Number of Loans",
      data: Object.values(loanSummary),
      backgroundColor: ["#3b82f6", "#facc15", "#22c55e", "#ef4444"],
    }],
  };

  // Total loan per member
  const totalPerMember = useMemo(() => {
    const totals: Record<string, number> = {};
    members.forEach(m => { totals[m.id] = 0; });
    loans.forEach(loan => { totals[loan.memberId] += loan.amount; });
    return totals;
  }, [loans, members]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Loan Management</h1>

      {/* Add Loan Form */}
      <form onSubmit={handleAddLoan} className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <select value={memberId} onChange={(e) => setMemberId(e.target.value)} className="border rounded-lg p-2">
          <option value="">Select Member</option>
          {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="border rounded-lg p-2" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border rounded-lg p-2" />
        <input type="text" placeholder="Repayment Term" value={repaymentTerm} onChange={(e) => setRepaymentTerm(e.target.value)} className="border rounded-lg p-2" />
        <input type="number" step="0.01" placeholder="Interest Rate (%)" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="border rounded-lg p-2" />
        <select value={status} onChange={(e) => setStatus(e.target.value as LoanStatus)} className="border rounded-lg p-2">
          {["Pending","Active","Repaid","Defaulted"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 col-span-full">Add Loan</button>
      </form>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input type="text" placeholder="Search loans..." value={search} onChange={(e) => setSearch(e.target.value)} className="border rounded-lg p-2 flex-1" />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as LoanStatus | "All")} className="border rounded-lg p-2">
          <option value="All">All Statuses</option>
          {["Pending","Active","Repaid","Defaulted"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} className="border rounded-lg p-2" />
        <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} className="border rounded-lg p-2" />
      </div>

      {/* Loan Table */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white rounded-xl shadow-md">
          <thead className="bg-gray-100">
            <tr>
              {["Member","Amount","Date","Term","Rate","Status","Actions"].map((col,i) => (
                <th key={i} onClick={() => toggleSort(col.toLowerCase() as keyof typeof loans[0])} className="text-left p-3 cursor-pointer">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSortedLoans.map(loan => {
              const member = members.find(m => m.id === loan.memberId);
              const isEditing = editingLoanId === loan.id;
              const overdue = new Date() > new Date(loan.date) && loan.status !== "Repaid";
              return (
                <tr key={loan.id} className={`border-t ${overdue ? "bg-red-50" : ""}`}>
                  <td className="p-3">{isEditing ? <select value={editData.memberId} onChange={(e)=>setEditData({...editData, memberId:e.target.value})}>{members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select> : member?.name || "Unknown"}</td>
                  <td className="p-3">{isEditing ? <input type="number" value={editData.amount} onChange={(e)=>setEditData({...editData, amount:e.target.value})}/> : `$${loan.amount.toFixed(2)}`}</td>
                  <td className="p-3">{isEditing ? <input type="date" value={editData.date} onChange={(e)=>setEditData({...editData, date:e.target.value})}/> : loan.date}</td>
                  <td className="p-3">{isEditing ? <input type="text" value={editData.repaymentTerm} onChange={(e)=>setEditData({...editData, repaymentTerm:e.target.value})}/> : loan.repaymentTerm}</td>
                  <td className="p-3">{isEditing ? <input type="number" step="0.01" value={editData.interestRate} onChange={(e)=>setEditData({...editData, interestRate:e.target.value})}/> : `${loan.interestRate}%`}</td>
                  <td className="p-3">{isEditing ? <select value={editData.status} onChange={(e)=>setEditData({...editData, status:e.target.value as LoanStatus})}>{["Pending","Active","Repaid","Defaulted"].map(s=><option key={s} value={s}>{s}</option>)}</select> : <span className={`text-white px-2 py-1 rounded-lg ${statusColor(loan.status)}`}>{loan.status}</span>}</td>
                  <td className="p-3 flex gap-2">{isEditing ? <>
                    <button onClick={()=>saveEdit(loan.id)} className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600">Save</button>
                    <button onClick={cancelEdit} className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600">Cancel</button>
                  </> : <>
                    <button onClick={()=>startEditing(loan.id)} className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600">Edit</button>
                    <button onClick={()=>deleteLoan(loan.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">Delete</button>
                  </>}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Loan Summary Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Loan Summary</h2>
        <Bar data={chartData} />
      </div>

      {/* Total Loan per Member */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Total Loan Amount per Member</h2>
        <ul>
          {members.map(m => (
            <li key={m.id}>{m.name}: ${totalPerMember[m.id].toFixed(2)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LoanManagement;
