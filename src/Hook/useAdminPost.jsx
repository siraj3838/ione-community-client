import { useContext, useState } from "react";
import useAxios from "./useAxios";
import { AuthContext } from "../Providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";

const useAdminPost = () => {
    const myAxios = useAxios();
    const [asc, setAsc] = useState(false)
    const { user } = useContext(AuthContext);
    const { data: adminPost = [], refetch } = useQuery({
        queryKey: ['adminPost', user?.email, asc],
        queryFn: async () => {
            const res = await myAxios.get(`/adminPosts?sort=${asc ? '' : 'asc'}`)
            return res.data;
        },
    })
    return [adminPost, refetch];
};

export default useAdminPost;