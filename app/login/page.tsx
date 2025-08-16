"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Hardcoded credentials for demo
    const users = [
      { email: "admin@example.com", password: "admin123", role: "admin" },
      { email: "user@example.com", password: "user123", role: "user" },
    ];

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", foundUser.role);
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-green-100">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Sign in to manage your HR & payroll
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
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
            Sign In
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-green-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
