"use client"

import Hero from "@/Components/Page_Components/Home/Hero";
import Status from "@/Components/Page_Components/Home/Status";
import Today_meal from "@/Components/Page_Components/Home/Today_meal";
import ProtectedRoute from "@/Components/Routes/ProtectedRoute";
import { useState } from "react";

export default function Home() {
  const [reload_status, setReload_status] = useState(false);
  const [status, setStatus] = useState({});
  
  return (
    <ProtectedRoute >
      <div className="min-h-screen bg-[#ff990020] ">
        <div className="max-w-[1200px] mx-auto w-[92%] pb-10">
          <Hero reload_status={reload_status} setReload_status={setReload_status} setStatus={setStatus} />
          <Status reload_status={reload_status} c_status={status} />
          <Today_meal setReload_status={setReload_status} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
