"use client";

import useAxiosPublic from "@/providers/useAxiosPublic";
import { useState, useEffect } from "react";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import Swal from "sweetalert2";
import ProtectedRoute from "@/Components/Routes/ProtectedRoute";

export default function UsersPage() {
  const axiosPublic = useAxiosPublic();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "member",
    rented_sit: "",
    sit_rent: "",
    joining_date: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axiosPublic.get("/users");
    setUsers(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        const res = await axiosPublic.patch(`/users/${selectedUser._id}`, formData);
        if (res?.data.modifiedCount) {
          Swal.fire("Updated!", "User data has been updated.", "success");
        }
      } else {
        const res = await axiosPublic.post("/users", formData);
        if (res?.data.insertedId) {
          Swal.fire("Updated!", "User data has been Created.", "success");
        }
      }
      setShowModal(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "member",
        rented_sit: "",
        sit_rent: "",
        joining_date: "",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosPublic.delete(`/users/${id}`);
        fetchUsers();
        Swal.fire("Deleted!", "User has been deleted.", "success");
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="px-4 max-w-6xl mx-auto pt-10 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
          <button
            onClick={() => {
              setSelectedUser(null);
              setFormData({
                name: "",
                email: "",
                password: "",
                role: "member",
                rented_sit: "",
                sit_rent: "",
                joining_date: "",
              });
              setShowModal(true);
            }}
            className="bg-sky-500 text-white px-5 py-2 rounded hover:bg-sky-600 shadow"
          >
            + Add User </button> </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm font-semibold text-gray-700">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Rented Sit</th>
                <th className="p-2 border">Sit Rent</th>
                <th className="p-2 border">Joining Date</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="text-sm hover:bg-gray-50">
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">{user.phone}</td>
                  <td className="p-2 border">{user.role}</td>
                  <td className="p-2 border">{user.rented_sit || "-"}</td>
                  <td className="p-2 border">{user.sit_rent || "-"}</td>
                  <td className="p-2 border">{user.joining_date || "-"}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setFormData({
                          name: user.name,
                          email: user.email,
                          phone: user.phone,
                          password: user.password,
                          role: user.role,
                          rented_sit: user.rented_sit || "",
                          sit_rent: user.sit_rent || "",
                          joining_date: user.joining_date || "",
                        });
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
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
          <div onClick={() => setShowModal(false)} className="fixed inset-0 bg-[#0000004e] bg-opacity-30 flex items-center justify-center z-50">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg p-6 w-full max-w-lg relative shadow-lg">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-3 text-gray-600 text-xl"
              >
                &times;
              </button>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {selectedUser ? "Update User" : "Add New User"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <input
                  type="number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                  <div onClick={() => setShowPass(!showPass)} className="absolute top-1/2 -translate-y-1/2 right-3 text-xl text-gray-500 cursor-pointer">
                    {showPass ? <IoMdEyeOff /> : <IoEye />}
                  </div>
                </div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="member">Member</option>
                </select>
                <input
                  type="text"
                  name="rented_sit"
                  value={formData.rented_sit}
                  onChange={handleChange}
                  placeholder="Rented Sit"
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="text"
                  name="sit_rent"
                  value={formData.sit_rent}
                  onChange={handleChange}
                  placeholder="Sit Rent"
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="date"
                  name="joining_date"
                  value={formData.joining_date}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />

                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
                >
                  {selectedUser ? "Update" : "Create"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
