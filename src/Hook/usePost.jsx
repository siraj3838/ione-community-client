import { useContext, useState } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import useAxios from "./useAxios";
import { useQuery } from "@tanstack/react-query";

const usePost = () => {
    const { user, loading } = useContext(AuthContext);
    const myAxios = useAxios();
    const [asc, setAsc] = useState(false)
    const { data: userPost = [], refetch} = useQuery({
        queryKey: ['posts', user?.email, asc],
        enabled: !loading,
        queryFn: async () => {
            const res = await myAxios.get(`/userPost?sort=${asc ? '' : 'asc'}`)
            const findUserPost = res.data.filter(us => us.email == user?.email)

            return findUserPost;
        },
    })
    return [userPost, refetch];
};

export default usePost;