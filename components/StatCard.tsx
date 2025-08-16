// components/StatCard.tsx
"use client";
import { ReactNode } from "react";

export default function StatCard({ title, value, icon }: { title: string; value: string; icon?: ReactNode }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-400">{title}</div>
          <div className="text-xl font-semibold text-gray-900">{value}</div>
        </div>
        <div className="text-2xl text-green-600">{icon}</div>
      </div>
    </div>
  );
}
