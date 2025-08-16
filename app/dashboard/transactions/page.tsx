"use client";
import React, { useState } from "react";
import { useStore } from "@/lib/store"

export default function TransactionsPage() {
  const { getTransactions, addTransaction, deleteTransaction } = useStore();
  const transactions = getTransactions();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);

  const handleAdd = () => {
    if (!description || !amount) return;
    addTransaction({
      id:Date.now().toString(),
      description,
      amount,
    });
    setDescription("");
    setAmount(0);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Transactions</h1>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
        <button onClick={handleAdd}>Add Transaction</button>
      </div>

      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.description} - ${t.amount}{" "}
            <button onClick={() => deleteTransaction(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
