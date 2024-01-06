import { useContext, useState } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import useAxios from "../../Hook/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const UsersSavePost = () => {
    const { user } = useContext(AuthContext);
    const [asc, setAsc] = useState(false)
    const myAxios = useAxios();
    const { data: savePost = [] } = useQuery({
        queryKey: ['saved', user?.email, asc],
        queryFn: async () => {
            const res = await myAxios.get(`/savePost?sort=${asc ? '' : 'asc'}`)
            const findUserSavePost = res.data.filter(us => us.currentEmail == user?.email)
            return findUserSavePost;
        },
    })
    // console.log(savePost);
    return (
        <div className="space-y-2">
            {
                savePost.map(post => <Link key={post._id} to={`/savedPostDetails/${post._id}`}>
                    <div className="flex items-center gap-3 mb-2 p-2 rounded bg-blue-300 hover:scale-110 transition-all" >
                        <div>
                            <img className="w-10 h-10 rounded-full" src={post?.photo} alt="" />
                        </div>
                        <div>
                            <div className="flex items-center gap-12">
                                <h2 className="text-black font-semibold">{post?.name}</h2>
                                <p className="text-sm">{post?.time.slice(12,)}</p>
                            </div>
                            <p className="text-sm">{post?.text.slice(0, 12)}...</p>
                        </div>

                    </div>
                </Link>)
            }
        </div>
    );
};

export default UsersSavePost;