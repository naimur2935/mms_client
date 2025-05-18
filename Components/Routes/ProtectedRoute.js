"use client";

import useAuth from "@/providers/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token || (allowedRoles.length && !allowedRoles.includes(user?.role))) {
            localStorage.removeItem("token");
            router.push("/login");
        } else {
            setLoading(false);
        }
    }, [router]);

    if (loading) return <p>Loading...</p>;

    return children;
}
