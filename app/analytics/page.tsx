"use client";

import { FaChartBar } from "react-icons/fa";

export default function AnalyticsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black mb-6">Analytics</h1>
      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center">
        <FaChartBar className="text-green-500 text-5xl mb-4" />
        <p className="text-gray-600">
          Charts and reports will appear here once connected to live data.
        </p>
      </div>
    </div>
  );
}
