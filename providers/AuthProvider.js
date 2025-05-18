"use client";
import { createContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosPublic from "./useAxiosPublic";
import { useRouter } from "next/navigation";

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const axiosPublic = useAxiosPublic();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if the user is logged in on load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axiosPublic.get("/auth", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data); // assumes data contains user object
        } catch (error) {
          console.error("Error verifying token:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [axiosPublic]);

  // Login
  const login = async (email, password) => {
    try {
      const response = await axiosPublic.post("/login", { email, password });
      const { token, user } = response?.data;

      localStorage.setItem("token", token);
      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    router?.push("/login");
    setUser(null);
    Swal.fire({ title: "Logout Successful!", icon: "success" });
  };

  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
