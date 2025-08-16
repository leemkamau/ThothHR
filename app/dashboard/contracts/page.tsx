"use client";

import { useState } from "react";
import { useStore, Member, Contract } from "@/lib/store";

export default function ContractsPage() {
  const { getMembers, getContracts, addContract, deleteContract } = useStore();
  const members = getMembers();
  const contracts = getContracts();

  const [title, setTitle] = useState("");
  const [memberId, setMemberId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<Contract["status"]>("Active");
  const [search, setSearch] = useState("");

  const handleAddContract = () => {
    if (!title || !memberId || !startDate || !endDate) return;

    addContract({
      title,
      memberId,
      startDate,
      endDate,
      status,
    });

    setTitle("");
    setMemberId("");
    setStartDate("");
    setEndDate("");
    setStatus("Active");
  };

  const filteredContracts = contracts.filter((c) => {
    const member = members.find((m) => m.id === c.memberId);
    return (
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      member?.name.toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto text-black">
      <h1 className="text-3xl font-bold mb-6">Contracts</h1>

      {/* Add Contract Form */}
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <select
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
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
          type="text"
          placeholder="Contract Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />

        <button
          onClick={handleAddContract}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition"
        >
          Add Contract
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search contracts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Contracts Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {["Employee", "Title", "Start Date", "End Date", "Status", "Actions"].map(
                (col, i) => (
                  <th key={i} className="p-2 text-left">
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredContracts.map((c) => {
              const member = members.find((m) => m.id === c.memberId);
              return (
                <tr
                  key={c.id}
                  className="border-b even:bg-gray-50 hover:bg-gray-100 transition"
                >
                  <td className="p-2">{member?.name || "Unknown"}</td>
                  <td className="p-2">{c.title}</td>
                  <td className="p-2">{c.startDate}</td>
                  <td className="p-2">{c.endDate}</td>
                  <td className="p-2">{c.status}</td>
                  <td className="p-2">
                    <button
                      onClick={() => deleteContract(c.id)}
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
    </div>
  );
}

