"use client"
import useAuth from "@/providers/useAuth";
import useAxiosPublic from "@/providers/useAxiosPublic";
import { useEffect, useState } from "react"

export default function Status({ c_status,  reload_status }) {
    const axiosPublic = useAxiosPublic();
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [food_bill, setFood_bill] = useState(0);
    const [u_p_r_bill, setU_p_r_bill] = useState(0);
    const { total_m, your_m, food_c, utility_c } = c_status;
    let now = new Date();
    now = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    useEffect(() => {
        axiosPublic.get("/users").then(res => {
            setUsers(res.data)
        })
        axiosPublic.get(`/bills?month=${now}`).then(res => {
            const m_bills = res?.data;
            const y_f_bills = res?.data?.filter(b => (b?.userId === user?._id) && (b?.type === "food"));
            const u_p_r_bill = res?.data?.filter(b => (b?.userId === user?._id) && (b?.type !== "food"));
            setFood_bill(y_f_bills?.reduce((t, c) => t + parseFloat(c?.amount), 0));
            setU_p_r_bill(u_p_r_bill?.reduce((t, c) => t + parseFloat(c?.amount), 0));
            //   setYourBills(y_bills?.reduce((t,c)=> t+(parseFloat(c?.breakfast)+parseFloat(c?.lunch)+parseFloat(c?.dinner)), 0))
        })
    }, [axiosPublic, reload_status])

    const utility_rate = utility_c / (users?.length - 1);

    const meal_due_status = food_bill - ((food_c / total_m) * your_m);
    const u_p_r_due_status = u_p_r_bill - (parseFloat(user?.sit_rent) + utility_rate);
    return (
        <section className="bg-white text-center mt-20 shadow-xl rounded-xl px-4 py-10">
            <h1 className="text-3xl text-[#FF9800] font-semibold underline">Your Courrent Status</h1>
            <div className="flex justify-around mt-12">
                <div className="space-y-3">
                    <h2 className={`text-5xl font-bold ${meal_due_status < 0 ? "text-[#ca0000]" : "text-green-700"} animate-pulse`}>{meal_due_status?.toFixed(1)} ৳</h2>
                    <h3 className="text-2xl font-medium">Your Meal Dues</h3>
                </div>
                <div className="space-y-3">
                    <h2 className="text-5xl font-bold text-[#ca0000] animate-pulse">{u_p_r_due_status?.toFixed(1)} ৳</h2>
                    <h3 className="text-2xl font-medium">Rent+Service</h3>
                </div>
            </div>
        </section>
    )
}
