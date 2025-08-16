"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

export default function RegisterPage() {
  const { addUser } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }
    addUser({ name, email, password });
    alert("User registered!");
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-green-100">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
          Create Your Account
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Join Thoth HR to simplify payroll and employee management
        </p>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 mt-1 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 mt-1 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mt-1 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
