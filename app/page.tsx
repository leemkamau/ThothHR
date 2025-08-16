"use client";

import Link from "next/link";
import { FaUsers, FaMoneyCheck, FaHandshake, FaPiggyBank } from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Top Navigation */}
      <header className="flex justify-between items-center px-8 py-6">
        <div className="text-2xl font-bold text-green-600">Thoth HR</div>
        <nav className="flex items-center gap-8">
          <Link
            href="/about"
            className="px-5 py-2 text-gray-700 hover:text-green-600 transition"
          >
            About
          </Link>
          <div className="flex gap-4">
            <Link
              href="/register"
              className="px-5 py-2 border border-green-600 text-green-600 rounded-full hover:bg-green-50 transition"
            >
              Register
            </Link>
            <Link
              href="/login"
              className="px-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
            >
              Sign In
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-16 md:py-24">
        {/* Left Content */}
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Your Trusted <span className="text-green-600">HR & Payroll</span> Partner
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Thoth HR helps you manage employees, payroll, loans, savings, and more —
            all in one beautiful, easy-to-use platform.
          </p>
        </div>

        {/* Right Graphic */}
        <div className="mt-12 md:mt-0 relative flex justify-center">
          <div className="bg-green-50 p-6 rounded-3xl shadow-xl relative overflow-hidden w-[350px] h-[400px]">
            <div className="absolute -top-6 left-6 rotate-[-6deg] bg-green-600 text-white p-6 rounded-2xl shadow-md w-40 h-28 flex flex-col justify-center items-center">
              <FaUsers size={28} />
              <span className="mt-2 text-sm">200+ Employees</span>
            </div>
            <div className="absolute top-12 right-0 rotate-[6deg] bg-white text-gray-800 p-6 rounded-2xl shadow-md w-44 h-28 flex flex-col justify-center items-center border border-gray-200">
              <FaMoneyCheck size={28} className="text-green-600" />
              <span className="mt-2 text-sm">Payroll Automation</span>
            </div>
            <div className="absolute bottom-8 left-6 rotate-[4deg] bg-green-100 text-gray-800 p-6 rounded-2xl shadow-md w-40 h-28 flex flex-col justify-center items-center">
              <FaHandshake size={28} className="text-green-600" />
              <span className="mt-2 text-sm">Loan Management</span>
            </div>
            <div className="absolute bottom-0 right-4 rotate-[-5deg] bg-white text-gray-800 p-6 rounded-2xl shadow-md w-44 h-28 flex flex-col justify-center items-center border border-gray-200">
              <FaPiggyBank size={28} className="text-green-600" />
              <span className="mt-2 text-sm">Savings Tracking</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
