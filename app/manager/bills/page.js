"use client";

import useAxiosPublic from "@/providers/useAxiosPublic";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ProtectedRoute from "@/Components/Routes/ProtectedRoute";

export default function BillsPage() {
    const axiosPublic = useAxiosPublic();
    const [users, setUsers] = useState([]);
    const [bills, setBills] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });
    const [formData, setFormData] = useState({
        userId: "",
        type: "",
        amount: "",
        date: "",
        note: ""
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedMonth) fetchBills(selectedMonth);
    }, [selectedMonth]);

    const fetchUsers = async () => {
        const res = await axiosPublic.get("/users");
        setUsers(res.data?.filter(u => u?.role !== "admin"));
    };

    const fetchBills = async (month) => {
        const res = await axiosPublic.get(`/bills?month=${month}`);
        setBills(res.data);
    };

    useEffect(() => {
        if (formData.type === "rent" && formData.userId) {
            const user = users.find((u) => u._id === formData.userId);
            setFormData((prev) => ({ ...prev, amount: user?.sit_rent || "" }));
        }
    }, [formData.type, formData.userId, users]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedBill) {
                await axiosPublic.patch(`/bills/${selectedBill._id}`, formData);
            } else {
                await axiosPublic.post("/bills", formData);
            }
            fetchBills(selectedMonth);
            setFormData({ userId: "", type: "", amount: "", date: "", note: "" });
            setSelectedBill(null);
            Swal.fire("Success", "Bill saved successfully", "success");
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Something went wrong", "error");
        }finally{
            setShowModal(false);
        }
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This bill will be deleted permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                await axiosPublic.delete(`/bills/${id}`);
                fetchBills(selectedMonth);
                Swal.fire("Deleted!", "Bill has been deleted.", "success");
            } catch (err) {
                console.error("Delete error:", err);
            }
        }

    };

    const generateMonthOptions = (monthsBack = 5) => {
        const options = [];
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // 0-based

        for (let i = 0; i < monthsBack; i++) {
            const d = new Date(year, month - i, 1);
            const yearStr = d.getFullYear();
            const monthStr = String(d.getMonth() + 1).padStart(2, "0");
            options.push(`${yearStr}-${monthStr}`);
        }
        return options;
    };


    const monthOptions = generateMonthOptions();



    return (
        <ProtectedRoute allowedRoles={["manager"]}> <div className="px-4 max-w-6xl mx-auto pt-10"> <h2 className="text-2xl font-semibold mb-6 text-center">Manage Bills</h2>
            <div className="flex justify-between items-center">
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Select Month</label>
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        {monthOptions.map((month) => {
                            const [year, monthNum] = month.split("-");
                            const date = new Date(Number(year), Number(monthNum) - 1, 1);
                            const label = date.toLocaleString("default", { month: "long", year: "numeric" }); // "May 2025"
                            return (
                                <option key={month} value={month}>
                                    {label}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <button
                    onClick={() => {
                        setShowModal(true);
                    }}
                    className="bg-sky-500 text-white px-5 py-2 rounded hover:bg-sky-600 shadow"
                >
                    + Collect Bill </button>
            </div>

            {showModal &&
                <div onClick={() => setShowModal(false)} className="fixed inset-0 bg-[#00000048] bg-opacity-30 flex items-center justify-center z-50">
                    <div onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg drop-shadow mb-10 max-w-xl">
                            <select
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                            >
                                <option value="">-- Select Member --</option>
                                {users.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>

                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                            >
                                <option value="">-- Select Bill Type --</option>
                                <option value="rent">Rent</option>
                                <option value="utility">Utility</option>
                                <option value="food">Food</option>
                            </select>

                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="Amount (৳)"
                                className="w-full border rounded px-3 py-2"
                                required
                            />

                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                                required
                            />

                            <textarea
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                placeholder="Note (optional)"
                                rows="2"
                                className="w-full border rounded px-3 py-2"
                            ></textarea>

                            <button
                                type="submit"
                                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-4 rounded"
                            >
                                {selectedBill ? "Update Bill" : "Create Bill"}
                            </button>
                        </form>
                    </div>
                </div>
            }

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded shadow">
                    <thead className="bg-gray-100">
                        <tr className="text-left text-sm font-semibold text-gray-700">
                            <th className="p-2 border">User</th>
                            <th className="p-2 border">Type</th>
                            <th className="p-2 border">Amount</th>
                            <th className="p-2 border">Date</th>
                            <th className="p-2 border">Note</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map((bill) => {
                            const user = users.find((u) => u._id === bill.userId);
                            return (
                                <tr key={bill._id} className="text-sm hover:bg-gray-50">
                                    <td className="p-2 border">{user?.name || "-"}</td>
                                    <td className="p-2 border">{bill.type}</td>
                                    <td className="p-2 border">৳ {bill.amount}</td>
                                    <td className="p-2 border">{bill.date}</td>
                                    <td className="p-2 border">{bill.note || "-"}</td>
                                    <td className="p-2 border space-x-2">
                                        <button
                                            onClick={() => {
                                                setShowModal(true);
                                                setSelectedBill(bill);
                                                setFormData({
                                                    userId: bill.userId,
                                                    type: bill.type,
                                                    amount: bill.amount,
                                                    date: bill.date,
                                                    note: bill.note || ""
                                                });
                                            }}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(bill._id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {
                    !bills?.length &&
                    <div className="w-full min-h-[50vh] flex justify-center items-center text-3xl font-semibold animate-pulse">
                        <h1 className="">No billing details Found...</h1>
                    </div>
                }
            </div>
        </div>
        </ProtectedRoute>
    );
}
