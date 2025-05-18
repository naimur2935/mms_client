"use client"
import useAuth from "@/providers/useAuth";
import useAxiosPublic from "@/providers/useAxiosPublic";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Today_meal({setReload_status}) {
    const axiosPublic = useAxiosPublic();
    const { user } = useAuth();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [meal, setMeal] = useState({
        email: user?.email,
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        date: tomorrow?.toISOString().split('T')[0],
    });

    useEffect(() => {
        axiosPublic?.get(`/meals/${user?.email}/${tomorrow?.toISOString().split('T')[0]}`)
            .then(res => {
                const found = res?.data;
                if (found) {
                    setMeal({ ...meal, breakfast: found?.breakfast, lunch: found?.lunch, dinner: found?.dinner })
                }
            })
    }, [])


    const handleChange = (e) => {
        setMeal({
            ...meal,
            [e.target.name]: parseFloat(e.target.value),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axiosPublic.post("/meals", meal)
            if (res?.data.modifiedCount || res?.data.insertedId) {
                Swal.fire("Updated!", "User meals updated successfully", "success");
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("Failed to update meals:", error);
        }finally{
            setReload_status(true)
        }
    };

    return (
        <section className="mt-20 p-6 md:p-10 shadow-xl rounded-xl bg-white text-center">
            <h1 className="text-3xl md:text-4xl text-[#FF9800] font-bold underline mb-8">Add Tomorrow Meals</h1>

            <form
                className="flex flex-col md:flex-row flex-wrap justify-center gap-6 md:gap-10 items-center"
                onSubmit={handleSubmit}
            >
                {/* Breakfast */}
                <div className="flex flex-col items-start">
                    <label className="font-medium mb-1">Breakfast</label>
                    <select
                        name="breakfast"
                        value={meal.breakfast}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md px-4 py-1"
                    >
                        <option value={0}>0</option>
                        <option value={0.5}>0.5</option>
                        <option value={1}>1</option>
                        <option value={1.5}>1.5</option>
                        <option value={2}>2</option>
                    </select>
                </div>

                {/* Lunch */}
                <div className="flex flex-col items-start">
                    <label className="font-medium mb-1">Lunch</label>
                    <select
                        name="lunch"
                        value={meal.lunch}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md px-4 py-1"
                    >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                    </select>
                </div>

                {/* Dinner */}
                <div className="flex flex-col items-start">
                    <label className="font-medium mb-1">Dinner</label>
                    <select
                        name="dinner"
                        value={meal.dinner}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md px-4 py-1"
                    >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-[#FF9800] text-white hover:scale-105 font-semibold px-6 py-2 rounded-lg hover:bg-[#e68900] transition-all duration-300 mt-4 md:mt-0"
                >
                    Update
                </button>
            </form>
        </section>
    );
}
