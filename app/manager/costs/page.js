"use client";

import { useEffect, useState } from "react";
import useAxiosPublic from "@/providers/useAxiosPublic";
import Swal from "sweetalert2";
import ProtectedRoute from "@/Components/Routes/ProtectedRoute";

export default function AllCostsPage() {
  const axiosPublic = useAxiosPublic();
  const [costs, setCosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCost, setSelectedCost] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    date: "",
    note: ""
  });

  useEffect(() => {
    fetchCosts();
  }, []);

  const fetchCosts = async () => {
    const res = await axiosPublic.get("/costs");
    setCosts(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCost) {
        await axiosPublic.patch(`/costs/${selectedCost._id}`, formData);
      } else {
        await axiosPublic.post("/costs", formData);
      }
      setShowModal(false);
      setFormData({ type: "", amount: "", date: "", note: "" });
      fetchCosts();
    } catch (error) {
      console.error("Error saving cost:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This cost will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosPublic.delete(`/costs/${id}`);
        fetchCosts();
        Swal.fire("Deleted!", "Cost has been deleted.", "success");
      } catch (err) {
        console.error("Delete error:", err);
      }
    }

  };

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="p-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Costs</h2>
        <button
          onClick={() => {
            setSelectedCost(null);
            setFormData({ type: "", amount: "", date: "", note: "" });
            setShowModal(true);
          }}
          className="bg-sky-500 text-white px-5 py-2 rounded hover:bg-sky-600 shadow"
        >
          + Add Cost </button> </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Note</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {costs.map((cost) => (
              <tr key={cost._id} className="text-sm hover:bg-gray-50">
                <td className="p-2 border">{cost.type}</td>
                <td className="p-2 border">৳ {cost.amount}</td>
                <td className="p-2 border">{cost.date}</td>
                <td className="p-2 border">{cost.note || "-"}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => {
                      setSelectedCost(cost);
                      setFormData({
                        type: cost.type,
                        amount: cost.amount,
                        date: cost.date,
                        note: cost.note || ""
                      });
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cost._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} className="fixed inset-0 bg-[#00000048] bg-opacity-30 flex items-center justify-center z-50">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg p-6 w-full max-w-lg relative shadow-lg">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-600 text-xl"
            >
              &times;
            </button>

            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {selectedCost ? "Update Cost" : "Add New Cost"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select Type</option>
                <option value="food">Food</option>
                <option value="utility">Utility</option>
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
                rows="3"
                className="w-full border rounded px-3 py-2"
              ></textarea>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
              >
                {selectedCost ? "Update" : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}
