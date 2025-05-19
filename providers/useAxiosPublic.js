import axios from "axios";

const axiosPublic = axios.create({
    baseURL:'https://mms-server-9ix2.onrender.com',
    headers: {
        "Content-Type": "application/json",
    },
})
const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;