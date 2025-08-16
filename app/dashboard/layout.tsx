"use client"; // This makes it run on the client side so we can use localStorage

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn || isLoggedIn !== "true") {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
