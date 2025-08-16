"use client";

// Import Zustand and middleware for persistent storage
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuid } from "uuid"; // UUID generator for unique IDs
import mockDataJson from "@/database/data.json"; // Mock data for initial state

// ========================
// ==== TYPES =============
// ========================

// User type definition
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

// Status for members
export type MemberStatus = "Active" | "Inactive" | "Terminated";

// Member type definition
export type Member = {
  id: string;
  name: string;
  email: string;
  position?: string;
  department?: string;
  phone?: string;
  hireDate?: string;
  status: MemberStatus;
  profilePicture?: string;
};

// New member type for creating members (id and status optional)
export type NewMember = Omit<Member, "id" | "status"> & { status?: MemberStatus };

// Status for loans
export type LoanStatus = "Active" | "Repaid" | "Defaulted" | "Pending";

// Loan type definition
export type Loan = {
  id: string;
  memberId: string;
  amount: number;
  date: string;
  interestRate?: number;
  repaymentTerm?: string;
  status: LoanStatus;
};

// Saving type definition
export type Saving = {
  id: string;
  memberId: string;
  amount: number;
  date: string;
};

// Payroll type definition
export type Payroll = {
  id: string;
  memberId: string;
  salary: number;
  basic?: number;
  allowances?: number;
  deductions?: number;
  netPay?: number;
  month?: string;
  date: string;
  status: "Paid" | "Pending";
};

// Transaction type definition
export type Transaction = {
  id: string;
  memberId: string;
  description?: string;
  type?: "Credit" | "Debit";
  amount: number;
  date: string;
};

// Contract type definition
export type Contract = {
  id: string;
  memberId: string;
  title: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Expired" | "Terminated";
};

// ========================
// ==== MOCK DATA =========
// ========================

// Type for the mock data JSON
type MockDataType = {
  users?: User[];
  members: Member[];
  loans: Loan[];
  savings: Saving[];
  payrolls: Payroll[];
  transactions: Transaction[];
  contracts?: Contract[];
};

// Load mock data from JSON
const mockData: MockDataType = mockDataJson as MockDataType;

// ========================
// ==== STORE INTERFACE ====
// ========================

// Interface defining the store state and actions
interface StoreState {
  users: User[];
  members: Member[];
  loans: Loan[];
  savings: Saving[];
  payrolls: Payroll[];
  transactions: Transaction[];
  contracts: Contract[];

  // Users actions
  addUser: (user: Omit<User, "id">) => void;
  getUsers: () => User[];

  // Members actions
  addMember: (member: NewMember) => void;
  getMembers: () => Member[];
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;

  // Loans actions
  addLoan: (loan: Omit<Loan, "id">) => void;
  getLoans: () => Loan[];
  updateLoan: (id: string, updates: Partial<Loan>) => void;
  deleteLoan: (id: string) => void;

  // Savings actions
  addSaving: (saving: Omit<Saving, "id">) => void;
  getSavings: () => Saving[];
  updateSaving: (id: string, updates: Partial<Saving>) => void;
  deleteSaving: (id: string) => void;

  // Payrolls actions
  addPayroll: (payroll: Omit<Payroll, "id" | "status" | "date"> & { status?: "Paid" | "Pending" }) => void;
  getPayrolls: () => Payroll[];
  markPayrollAsPaid: (id: string) => void;
  updatePayroll: (id: string, updates: Partial<Payroll>) => void;
  deletePayroll: (id: string) => void;

  // Transactions actions
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  getTransactions: () => Transaction[];
  deleteTransaction: (id: string) => void;

  // Contracts actions
  addContract: (contract: Omit<Contract, "id">) => void;
  getContracts: () => Contract[];
  deleteContract: (id: string) => void;
}

// ========================
// ==== STORE ==============
// ========================

// Create Zustand store with persistent storage
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // INITIAL STATE
      users: mockData.users || [],
      members: mockData.members || [],
      loans: mockData.loans || [],
      savings: mockData.savings || [],
      payrolls: mockData.payrolls.map((p) => ({
        ...p,
        status: p.status ?? "Pending", // default status if missing
        date: p.date ?? new Date().toISOString(), // default date
        salary: p.salary ?? p.netPay ?? 0, // default salary
      })),
      transactions: mockData.transactions || [],
      contracts: mockData.contracts || [],

      // ====================
      // ===== USERS =========
      // ====================
      addUser: (user) => set((state) => ({ users: [...state.users, { ...user, id: uuid() }] })),
      getUsers: () => get().users,

      // ====================
      // ===== MEMBERS ======
      // ====================
      addMember: (member) =>
        set((state) => ({
          members: [...state.members, { ...member, id: uuid(), status: member.status ?? "Active" }],
        })),
      getMembers: () => get().members,
      updateMember: (id, updates) =>
        set((state) => ({ members: state.members.map((m) => (m.id === id ? { ...m, ...updates } : m)) })),
      deleteMember: (id) => set((state) => ({ members: state.members.filter((m) => m.id !== id) })),

      // ====================
      // ===== LOANS ========
      // ====================
      addLoan: (loan) =>
        set((state) => ({
          loans: [
            ...state.loans,
            {
              ...loan,
              id: uuid(),
              interestRate: loan.interestRate ?? 0,
              repaymentTerm: loan.repaymentTerm ?? "6 months",
              status: loan.status ?? "Pending",
              date: loan.date ?? new Date().toISOString(),
            },
          ],
        })),
      getLoans: () => get().loans,
      updateLoan: (id, updates) => set((state) => ({ loans: state.loans.map((l) => (l.id === id ? { ...l, ...updates } : l)) })),
      deleteLoan: (id) => set((state) => ({ loans: state.loans.filter((l) => l.id !== id) })),

      // ====================
      // ===== SAVINGS ======
      // ====================
      addSaving: (saving) => set((state) => ({ savings: [...state.savings, { ...saving, id: uuid(), date: saving.date ?? new Date().toISOString() }] })),
      getSavings: () => get().savings,
      updateSaving: (id, updates) => set((state) => ({ savings: state.savings.map((s) => ({ ...s, ...updates, date: s.date ?? new Date().toISOString() })) })),
      deleteSaving: (id) => set((state) => ({ savings: state.savings.filter((s) => s.id !== id) })),

      // ====================
      // ===== PAYROLLS =====
      // ====================
      addPayroll: (payroll) =>
        set((state) => ({
          payrolls: [...state.payrolls, { ...payroll, id: uuid(), status: payroll.status ?? "Pending", date: new Date().toISOString() }],
        })),
      getPayrolls: () => get().payrolls,
      markPayrollAsPaid: (id) => {
        const state = get();
        const payroll = state.payrolls.find((p) => p.id === id);
        if (!payroll || payroll.status === "Paid") return;

        // Mark payroll as paid
        const updatedPayrolls = state.payrolls.map((p) => (p.id === id ? { ...p, status: "Paid" } : p));

        // Update loans linked to member
        const updatedLoans = state.loans.map((loan) =>
          loan.memberId === payroll.memberId && loan.status === "Active" ? { ...loan, status: "Repaid" } : loan
        );

        //set({ payrolls: updatedPayrolls, loans: updatedLoans });
      },
      updatePayroll: (id, updates) => set((state) => ({ payrolls: state.payrolls.map((p) => (p.id === id ? { ...p, ...updates } : p)) })),
      deletePayroll: (id) => set((state) => ({ payrolls: state.payrolls.filter((p) => p.id !== id) })),

      // ====================
      // === TRANSACTIONS ===
      // ====================
      addTransaction: (tx) => set((state) => ({ transactions: [...state.transactions, { ...tx, id: uuid(), date: tx.date ?? new Date().toISOString() }] })),
      getTransactions: () => get().transactions,
      deleteTransaction: (id) => set((state) => ({ transactions: state.transactions.filter((t) => t.id !== id) })),

      // ====================
      // ===== CONTRACTS =====
      // ====================
      addContract: (contract) => set((state) => ({ contracts: [...state.contracts, { ...contract, id: uuid() }] })),
      getContracts: () => get().contracts,
      deleteContract: (id) => set((state) => ({ contracts: state.contracts.filter((c) => c.id !== id) })),
    }),
    { name: "thoth-hr-store" } // Persist to localStorage under this key
  )
);
