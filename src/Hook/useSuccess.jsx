import { useContext, useState } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import useAxios from "./useAxios";
import { useQuery } from "@tanstack/react-query";

const useSuccess = () => {
    const { loading } = useContext(AuthContext);
    const [asc, setAsc] = useState(false)
    const myAxios = useAxios();
    const { data: userReportSuccess = [], refetch} = useQuery({
        queryKey: ['success', asc],
        enabled: !loading,
        queryFn: async () => {
            const res = await myAxios.get(`/reportSuccess?sort=${asc ? '' : 'asc'}`)
            if(res.data.length){
                refetch();
            }
            return res.data;
        },
    })
    return [userReportSuccess, refetch];
};

export default useSuccess;