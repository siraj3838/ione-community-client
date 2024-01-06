import { useContext, useState } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import useAxios from "./useAxios";
import { useQuery } from "@tanstack/react-query";

const useSavePost = () => {
    const { user } = useContext(AuthContext);
    const [asc, setAsc] = useState(false)
    const myAxios = useAxios();
    const { data: savePost = [], refetch } = useQuery({
        queryKey: ['saved', user?.email, asc],
        queryFn: async () => {
            const res = await myAxios.get(`/savePost?sort=${asc ? '' : 'asc'}`)
            const findUserSavePost = res.data.filter(us => us.currentEmail == user?.email)
            return findUserSavePost;
        },
    })
    return [savePost, refetch]
};

export default useSavePost;