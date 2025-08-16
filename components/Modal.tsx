// components/Modal.tsx
"use client";
import { ReactNode } from "react";

export default function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 z-10">
        {children}
      </div>
    </div>
  );
}
