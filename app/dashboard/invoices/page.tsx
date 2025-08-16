"use client";

import { FaFileInvoice, FaDownload } from "react-icons/fa";

export default function InvoicesPage() {
  const invoices = [
    { id: 1, client: "Acme Corp", amount: 2500, date: "2025-07-10" },
    { id: 2, client: "John Doe", amount: 1200, date: "2025-06-20" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black mb-6">Invoices</h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="p-4">Client</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Date</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((i) => (
              <tr key={i.id} className="border-t hover:bg-gray-50">
                <td className="p-4">{i.client}</td>
                <td className="p-4">KES {i.amount.toLocaleString()}</td>
                <td className="p-4">{i.date}</td>
                <td className="p-4">
                  <button className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                    <FaDownload /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
