"use client";

import { useState } from "react";
import { useStore, Saving as SavingType, Member } from "@/lib/store";

export default function SavingsPage() {
  const { getSavings, getMembers, addSaving, updateSaving, deleteSaving } = useStore();

  const savings = getSavings();
  const members = getMembers();

  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof SavingType>("memberId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddOrUpdateSaving = () => {
    if (!memberId || !amount) return;

    const numericAmount = parseFloat(amount);

    if (editingId) {
      updateSaving(editingId, { memberId, amount: numericAmount });
      setEditingId(null);
    } else {
      addSaving({ memberId, amount: numericAmount, date: new Date().toISOString() });
    }

    setMemberId("");
    setAmount("");
  };

  const handleEditSaving = (id: string) => {
    const saving = savings.find((s) => s.id === id);
    if (!saving) return;
    setMemberId(saving.memberId);
    setAmount(saving.amount.toString());
    setEditingId(saving.id);
  };

  const handleDeleteSaving = (id: string) => deleteSaving(id);

  const toggleSort = (key: keyof SavingType) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const displayedSavings = [...savings]
    .filter((s) => {
      const member = members.find((m) => m.id === s.memberId);
      return (
        member?.name.toLowerCase().includes(search.toLowerCase()) ||
        s.amount.toString().includes(search)
      );
    })
    .sort((a, b) => {
      if (sortKey === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
      const nameA = members.find((m) => m.id === a.memberId)?.name || "";
      const nameB = members.find((m) => m.id === b.memberId)?.name || "";
      return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

  const totalSavings = savings.reduce((sum, s) => sum + s.amount, 0);

  // CSV Export
  const handleExportCSV = () => {
    const headers = ["Member", "Amount", "Date"];
    const rows = displayedSavings.map((s) => {
      const member = members.find((m) => m.id === s.memberId);
      return [member?.name || "Unknown", s.amount, new Date(s.date).toLocaleDateString()];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `savings_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-black">
      <h1 className="text-3xl font-bold mb-6">Savings</h1>

      {/* Add / Edit Saving */}
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <select
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          className="border p-2 rounded flex-1 focus:ring-2 focus:ring-green-400"
        >
          <option value="">Select Member</option>
          {members.map((m: Member) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded flex-1 focus:ring-2 focus:ring-green-400"
        />

        <button
          onClick={handleAddOrUpdateSaving}
          className={`${
            editingId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"
          } text-white px-4 py-2 rounded shadow transition`}
        >
          {editingId ? "Update" : "Add"}
        </button>

        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setMemberId("");
              setAmount("");
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow transition"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Search, Total & Export */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by member or amount..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1 focus:ring-2 focus:ring-green-400"
        />
        <div className="text-lg font-semibold">
          Total Savings: KSh {totalSavings.toLocaleString()}
        </div>
        <button
          onClick={handleExportCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
        >
          Export CSV
        </button>
      </div>

      {/* Savings Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-100 text-gray-700 sticky top-0">
            <tr>
              <th
                className="p-2 text-left cursor-pointer"
                onClick={() => toggleSort("memberId")}
              >
                Member {sortKey === "memberId" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th
                className="p-2 text-left cursor-pointer"
                onClick={() => toggleSort("amount")}
              >
                Amount {sortKey === "amount" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedSavings.map((s) => {
              const member = members.find((m) => m.id === s.memberId);
              return (
                <tr key={s.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-2">{member?.name || "Unknown"}</td>
                  <td className="p-2">KSh {s.amount.toLocaleString()}</td>
                  <td className="p-2 flex justify-center gap-2">
                    <button
                      onClick={() => handleEditSaving(s.id)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSaving(s.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {displayedSavings.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No savings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


