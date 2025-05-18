"use client"

import useAuth from "@/providers/useAuth";
import useAxiosPublic from "@/providers/useAxiosPublic";
import { useEffect, useState } from "react"

export default function Hero({reload_status, setReload_status, setStatus}) {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const [meals, setMeals] = useState(0);
  const [yourMeals, setYourMeals] = useState(0);
  const [food_cost, setFood_cost] = useState(0);
  const [utility_cost, setUtility_cost] = useState(0);

  let now = new Date();
  now = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  useEffect(() => {
    let now = new Date();
    now = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  
    const fetchData = async () => {
      const mealRes = await axiosPublic.get(`/meals?month=${now}`);
      const m_meals = mealRes?.data || [];
      const y_meals = m_meals.filter(m => m?.email === user?.email);
  
      const totalMeals = m_meals.reduce((t, c) => t + (parseFloat(c.breakfast) + parseFloat(c.lunch) + parseFloat(c.dinner)), 0);
      const userMeals = y_meals.reduce((t, c) => t + (parseFloat(c.breakfast) + parseFloat(c.lunch) + parseFloat(c.dinner)), 0);
  
      const costRes = await axiosPublic.get(`/costs?month=${now}`);
      const allCosts = costRes?.data || [];
      const foodCosts = allCosts.filter(c => c?.type === "food");
      const utilityCosts = allCosts.filter(c => c?.type === "utility");
  
      const totalFoodCost = foodCosts.reduce((t, c) => t + parseFloat(c.amount), 0);
      const totalUtilityCost = utilityCosts.reduce((t, c) => t + parseFloat(c.amount), 0);
  
      setMeals(totalMeals);
      setYourMeals(userMeals);
      setFood_cost(totalFoodCost);
      setUtility_cost(totalUtilityCost);
  
      // ✅ Now pass correct values
      setStatus({
        total_m: totalMeals,
        your_m: userMeals,
        food_c: totalFoodCost,
        utility_c: totalUtilityCost,
      });
  
      setReload_status(false);
    };
  
    fetchData();
  }, [axiosPublic, reload_status]);

  
  return (
    <section className="pt-20 text-center">
      <div className="px-4 py-8 rounded-lg bg-white">
        <h1 className="text-3xl text-[#FF9800] font-semibold underline">This Month</h1>
        <div className="grid grid-cols-2 gap-x-6 gap-y-20 mt-8">
          <div className="shadow-xl py-14 rounded-xl space-y-3 ">
            <h2 className="text-5xl font-bold text-[#4CAF50] animate-pulse">{yourMeals}</h2>
            <h3 className="text-2xl font-medium">Your Meals</h3>
          </div>
          <div className="shadow-xl py-14 rounded-xl space-y-3 bg-white">
            <h2 className="text-5xl font-bold text-[#4CAF50] animate-pulse">{(food_cost/meals).toFixed(1)}</h2>
            <h3 className="text-2xl font-medium">Current Meal Rate</h3>
          </div>
          <div className="shadow-xl py-14 rounded-xl space-y-3 bg-white">
            <h2 className="text-5xl font-bold text-[#4CAF50] animate-pulse">{meals}</h2>
            <h3 className="text-2xl font-medium">Total Meals</h3>
          </div>
          <div className="shadow-xl py-14 rounded-xl space-y-3 bg-white">
            <h2 className="text-5xl font-bold text-[#4CAF50] animate-pulse">{food_cost} ৳</h2>
            <h3 className="text-2xl font-medium">Total Cost</h3>
          </div>
        </div>
      </div>
    </section>
  )
}
