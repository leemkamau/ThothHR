"use client";

import { useState } from "react";
import { useStore, Member } from "@/lib/store";
import { v4 as uuid } from "uuid";

// ==== LOCAL TYPES ====
type MemberForm = {
  name: string;
  email: string;
  position?: string;
  department?: string;
  phone?: string;
  hireDate?: string;
  status: "Active" | "Inactive" | "Terminated";
  profilePicture?: string;
};

export default function MembersPage() {
  const members = useStore((state) => state.getMembers());
  const addMember = useStore((state) => state.addMember);
  const updateMember = useStore((state) => state.updateMember);
  const deleteMember = useStore((state) => state.deleteMember);

  const [form, setForm] = useState<MemberForm>({
    name: "",
    email: "",
    position: "",
    department: "",
    phone: "",
    hireDate: "",
    status: "Active",
    profilePicture: "",
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<MemberForm>({
    name: "",
    email: "",
    position: "",
    department: "",
    phone: "",
    hireDate: "",
    status: "Active",
    profilePicture: "",
  });

  const [sortConfig, setSortConfig] = useState<{ key: keyof Member; direction: "asc" | "desc" } | null>(null);

  // === Handlers ===
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditForm({ ...editForm, profilePicture: reader.result as string });
        } else {
          setForm({ ...form, profilePicture: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    if (form.name && form.email) {
      addMember({ ...form });
      setForm({
        name: "",
        email: "",
        position: "",
        department: "",
        phone: "",
        hireDate: "",
        status: "Active",
        profilePicture: "",
      });
    }
  };

  const handleEdit = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setEditId(memberId);
      setEditForm({
        name: member.name || "",
        email: member.email || "",
        position: member.position || "",
        department: member.department || "",
        phone: member.phone || "",
        hireDate: member.hireDate || "",
        status: member.status || "Active",
        profilePicture: member.profilePicture || "",
      });
    }
  };

  const handleSaveEdit = () => {
    if (editId) {
      updateMember(editId, editForm);
      setEditId(null);
    }
  };

  // Sorting
  const sortedMembers = [...members].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aVal = (a[key] || "").toString().toLowerCase();
    const bVal = (b[key] || "").toString().toLowerCase();
    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const requestSort = (key: keyof Member) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="p-6 text-black">
      <h1 className="text-3xl font-bold mb-6">Employees</h1>

      {/* Add Employee Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-6 grid grid-cols-2 gap-4 border border-gray-200">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 rounded" />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 rounded" />
        <input name="position" placeholder="Position" value={form.position} onChange={handleChange} className="border p-2 rounded" />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border p-2 rounded" />
        <input name="department" placeholder="Department" value={form.department} onChange={handleChange} className="border p-2 rounded" />
        <input type="date" name="hireDate" value={form.hireDate} onChange={handleChange} className="border p-2 rounded" />
        <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Terminated">Terminated</option>
        </select>
        <input type="file" accept="image/*" onChange={(e) => handleProfileUpload(e, false)} className="border p-2 rounded col-span-2" />
        <button onClick={handleAdd} className="col-span-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">
          Add Employee
        </button>
      </div>

      {/* Employee Table */}
      <table className="w-full bg-white rounded-lg shadow border border-gray-200">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-2 cursor-pointer" onClick={() => requestSort("name")}>Name</th>
            <th className="p-2 cursor-pointer" onClick={() => requestSort("email")}>Email</th>
            <th className="p-2 cursor-pointer" onClick={() => requestSort("position")}>Position</th>
            <th className="p-2">Department</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Hire Date</th>
            <th className="p-2">Status</th>
            <th className="p-2">Profile</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedMembers.map((m) => (
            <tr key={m.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{m.name}</td>
              <td className="p-2">{m.email}</td>
              <td className="p-2">{m.position || "-"}</td>
              <td className="p-2">{m.department || "-"}</td>
              <td className="p-2">{m.phone || "-"}</td>
              <td className="p-2">{m.hireDate || "-"}</td>
              <td className="p-2">{m.status}</td>
              <td className="p-2">
                {m.profilePicture ? (
                  <img src={m.profilePicture} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  "-"
                )}
              </td>
              <td className="p-2 flex gap-2 justify-center">
                <button
                  onClick={() => handleEdit(m.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMember(m.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4">Edit Employee</h2>
            <div className="grid grid-cols-2 gap-4">
              <input name="name" value={editForm.name} onChange={handleEditChange} placeholder="Name" className="border p-2 rounded" />
              <input name="email" value={editForm.email} onChange={handleEditChange} placeholder="Email" className="border p-2 rounded" />
              <input name="position" value={editForm.position} onChange={handleEditChange} placeholder="Position" className="border p-2 rounded" />
              <input name="phone" value={editForm.phone} onChange={handleEditChange} placeholder="Phone" className="border p-2 rounded" />
              <input name="department" value={editForm.department} onChange={handleEditChange} placeholder="Department" className="border p-2 rounded" />
              <input type="date" name="hireDate" value={editForm.hireDate} onChange={handleEditChange} className="border p-2 rounded" />
              <select name="status" value={editForm.status} onChange={handleEditChange} className="border p-2 rounded">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Terminated">Terminated</option>
              </select>
              <input type="file" accept="image/*" onChange={(e) => handleProfileUpload(e, true)} className="border p-2 rounded col-span-2" />
              {editForm.profilePicture && (
                <div className="col-span-2 flex justify-center">
                  <img src={editForm.profilePicture} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditId(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


