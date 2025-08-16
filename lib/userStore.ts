// lib/userStore.ts
import fs from "fs";
import path from "path";
import { hash, compare } from "bcryptjs";

const USERS_FILE = path.join(process.cwd(), "users.json");

export type User = {
  id: string;
  name: string;
  email: string;
  password: string; // hashed
};

export function getUsers(): User[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, "utf-8");
  return JSON.parse(data) as User[];
}

export function saveUser(user: User) {
  const users = getUsers();
  users.push(user);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function registerUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const users = getUsers();
  const exists = users.find((u) => u.email === email);
  if (exists) throw new Error("User already exists");

  const hashed = await hash(password, 10);
  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    password: hashed,
  };

  saveUser(newUser);
  return newUser;
}

export async function authenticateUser(email: string, password: string) {
  const users = getUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return null;

  const valid = await compare(password, user.password);
  if (!valid) return null;

  return user;
}
