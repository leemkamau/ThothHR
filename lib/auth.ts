// lib/auth.ts
import { User } from "./Users";

export function login(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
}

export function getCurrentUser(): User | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  }
  return null;
}
