import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../Providers/AuthProvider";
import useAxios from "./useAxios";

const useReportPost = () => {
    const { loading } = useContext(AuthContext);
    const [asc, setAsc] = useState(false)
    const myAxios = useAxios();
    const { data: userReportPost = [], refetch} = useQuery({
        queryKey: ['reportPost', asc],
        enabled: !loading,
        queryFn: async () => {
            const res = await myAxios.get(`/userPost?sort=${asc ? '' : 'asc'}`)
            const findUserPost = res.data.filter(us => us.report == 'report')
            return findUserPost;
        },
    })
    return [userReportPost, refetch];
};

export default useReportPost;