import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";
import useAuth from "./useAuth";
import { useEffect } from "react";

const useWish = () => {
    const axiosPublic = useAxiosPublic();
    const { user } = useAuth();

    const { refetch: wishReload, data: WishRecords = { records: [], totalWish: 0 } } = useQuery({
        queryKey: ["WishRecords"],
        queryFn: async () => {
            const res = await axiosPublic.get(`/allWishlist/${user?.email}`);
            return res?.data;
        },
    });

    useEffect(()=>{
        wishReload();
    },[user])

    const wish = WishRecords?.records || [];
    const totalWish = WishRecords?.totalWish || 0;
    return {wish, totalWish, wishReload};
};

export default useWish;
