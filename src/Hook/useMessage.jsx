import { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import useAxios from "./useAxios";
import { useQuery } from "@tanstack/react-query";

const useMessage = () => {
    const { user, loading } = useContext(AuthContext);
    const myAxios = useAxios();
    const { data: allMessage = [], refetch } = useQuery({
        queryKey: ['message', user?.email],
        enabled: !loading,
        queryFn: async () => {
            const res = await myAxios.get('/messages')
            const findUser = res.data.filter(us => us.receiverEmail == user?.email && us.senderEmail != user?.email)
            return findUser;
        },
    })
    return [allMessage, refetch]
};

export default useMessage;