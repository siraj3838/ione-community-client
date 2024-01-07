import { useContext, useState } from "react";
import useAxios from "../../Hook/useAxios";
import { AuthContext } from "../../Providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { TbWorldCheck } from "react-icons/tb";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaUserLock } from "react-icons/fa";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const AdminAllPost = () => {
    const myAxios = useAxios();
    const [asc, setAsc] = useState(false)
    const { user } = useContext(AuthContext);
    const { data: userPost = [], refetch } = useQuery({
        queryKey: ['adminPost', user?.email, asc],
        queryFn: async () => {
            const res = await myAxios.get(`/adminPosts?sort=${asc ? '' : 'asc'}`)
            const findUserPost = res.data.filter(us => us.email == user?.email)
            return findUserPost;
        },
    })
    // console.log(userPost);

    const privateUpdate = (id) => {
        const privacy = 'Private';
        myAxios.put(`/adminPosts/private/${id}`, { privacy })
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    toast.success('This Post Are Private Now Only You See')
                    refetch();
                }
            })

    }
    const publicUpdate = (id) => {
        const privacy = 'Public';
        myAxios.put(`/adminPosts/public/${id}`, { privacy })
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    toast.success('This Post Are See All Public Now')
                    refetch();
                }
            })

    }


    const deletePost = (id) => {
        myAxios.delete(`/adminPosts/delete/${id}`)
            .then(res => {
                if (res.data.deletedCount > 0) {
                    toast.success('This Job Post Are Delete')
                    refetch();
                }
            })
    }


    return (
        <div>
            {
                userPost.map(post => <div className="md:m-5 md:p-5 px-5 lg:px-0 bg-white relative" key={post._id}>
                    <div className="flex bg-slate-100 w-full p-2 rounded-tl-full rounded-bl-full items-center gap-4">
                        <img className="w-16 h-16 rounded-full" src={post?.photo} alt="" />
                        <div className="">
                            <h1 className="text-xl font-medium">{post?.name}</h1>
                            <h2 className="text-gray-500">{post?.time.slice(5,)}</h2>
                        </div>
                    </div>
                    {post?.privacy == 'Public' ? <div className="dropdown dropdown-end text-2xl absolute top-8 right-20 md:top-12 md:right-24">
                        <div tabIndex={0} role="button" className=""><p className=""><TbWorldCheck></TbWorldCheck></p></div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li onClick={() => privateUpdate(post?._id)}><a>Private</a></li>
                        </ul>
                    </div>
                        :
                        ''
                    }
                    {
                        post?.privacy == 'Private' ? <div className="dropdown dropdown-end text-2xl absolute top-8 right-20 md:top-12 md:right-24">
                            <div tabIndex={0} role="button" className=""><p><FaUserLock></FaUserLock></p></div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">

                                <li onClick={() => publicUpdate(post?._id)}><a>Public</a></li>
                            </ul>
                        </div>
                            :
                            ''
                    }
                    <div className="text-2xl absolute top-8 right-10 md:top-12 md:right-10">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className=""><BsThreeDotsVertical></BsThreeDotsVertical></div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                <li onClick={() => deletePost(post?._id)}><a>Delete</a></li>
                            </ul>
                        </div>
                    </div>
                    {post.jobUrl ?
                        <div className="px-5 text-lg font-medium text-blue-500 underline my-2" >
                            {/* <a href= target="_blank" rel="noopener noreferrer"></a> */}
                            
                            <Link to={`${post?.jobUrl}`} target="_blank">
                                {post?.jobUrl}
                            </Link>
                        </div>
                        :
                        ''
                    }
                    {post.image ? <div className="border-2">
                        <img className="w-full h-48" src={post?.image} alt="" />
                    </div>
                        :
                        ''
                    }
                </div>)
            }
        </div>
    );
};

export default AdminAllPost;