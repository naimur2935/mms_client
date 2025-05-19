"use client"
import useAuth from "@/providers/useAuth";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { IoMdLogOut } from "react-icons/io";

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const path = usePathname();
    console.log(path)

    return (
        <nav className="h-[65px]">
            <div className="bg-[#4CAF50] fixed w-full">
                <div className={`max-w-[1200px] mx-auto w-[92%] flex ${user ? "justify-between" : "justify-center"} items-center py-2 text-white`}>
                    {/* logo */}
                    <section onClick={()=>router.push("/")} className="flex items-end space-x-1.5">
                        <figure className="relative h-12 w-14">
                            <Image
                                src="/images/icons/logo.png"
                                alt="Logo"
                                className=""
                                fill
                            />
                        </figure>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-[#ffffff] to-[#FF9800] text-transparent bg-clip-text leading-[19px]">
                            Meal<br />Management
                        </h2>
                    </section>
                    {/* Navigation Links */}
                    <div className="space-x-8 flex items-center text-sm sm:text-base text-gray-700 font-medium">
                        <button
                                onClick={() => router.push("/")}
                                className={`text-white hover:border-b-2 transition-colors duration-150 ${path === "/" && "border-b-2"} ${user || "hidden"}`}
                            >
                                Home
                            </button>
                        {user?.role === "admin" && (
                            <button
                                onClick={() => router.push("/admin")}
                                className={`text-white hover:border-b-2 transition-colors duration-150 ${path === "/admin" && "border-b-2"}`}
                            >
                                All Users
                            </button>
                        )}
                        {user?.role === "manager" && (
                            <>
                            <button
                                onClick={() => router.push("/manager/costs")}
                                className={`text-white hover:border-b-2 transition-colors duration-150 ${path === "/manager/costs" && "border-b-2"}`}
                            >
                                All Costs
                            </button>
                            <button
                                onClick={() => router.push("/manager/bills")}
                                className={`text-white hover:border-b-2 transition-colors duration-150 ${path === "/manager/bills" && "border-b-2"}`}
                            >
                                All Bills
                            </button>
                            </>
                        )}
                        {user && (
                            <button
                                onClick={logout}
                                className="text-[#fff] hover:text-red-600 hover:scale-105 duration-300 transition-all text-2xl"
                            >
                                <IoMdLogOut />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
