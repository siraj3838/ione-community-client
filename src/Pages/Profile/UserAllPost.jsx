import { useContext, useState } from "react";
import useAxios from "../../Hook/useAxios";
import { AuthContext } from "../../Providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { TbWorldCheck } from "react-icons/tb";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { FaUserLock } from "react-icons/fa";
import toast from "react-hot-toast";

const UserAllPost = () => {
    const myAxios = useAxios();
    const [asc, setAsc] = useState(false)
    const [like, setLike] = useState(0)
    const { user } = useContext(AuthContext);
    const { data: userPost = [], refetch } = useQuery({
        queryKey: ['posts', user?.email, asc],
        queryFn: async () => {
            const res = await myAxios.get(`/userPost?sort=${asc ? '' : 'asc'}`)
            const findUserPost = res.data.filter(us => us.email == user?.email)
            return findUserPost;
        },
    })
    // console.log(userPost);

    const privateUpdate = (id) => {
        const privacy = 'Private';
        myAxios.put(`/userPost/private/${id}`, { privacy })
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    toast.success('This Post Are Private Now Only You See')
                    refetch();
                }
            })
        
    }
    const publicUpdate = (id) => {
        const privacy = 'Public';
        myAxios.put(`/userPost/public/${id}`, { privacy })
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    toast.success('This Post Are See All Public Now')
                    refetch();
                }
            })
        
    }
    const friendUpdate = (id) => {
        const privacy = 'Friend';
        myAxios.put(`/userPost/friend/${id}`, { privacy })
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    toast.success('This Post Are See All User Now')
                    refetch();
                }
            })
        
    }



    const likePost = (post) => {
        const like = parseInt(post?.like)
        const likes = {like}
        myAxios.put(`/userPost/like/${post?._id}`, likes)
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    toast.success('Thank You for Like')
                    refetch();
                }
            })
    }

    const deletePost = (id) => {
        myAxios.delete(`/userPost/delete/${id}`)
        .then(res => {
            if (res.data.deletedCount > 0) {
                toast.success('This Post Delete')
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
                            <li onClick={() => friendUpdate(post?._id)}><a>User</a></li>
                            <li onClick={() => privateUpdate(post?._id)}><a>Private</a></li>
                        </ul>
                    </div>
                        :
                        ''
                    }
                    {
                        post?.privacy == 'Friend' ? <div className="dropdown dropdown-end text-2xl absolute top-8 right-20 md:top-12 md:right-24">
                            <div tabIndex={0} role="button" className=""><p><FaUserFriends></FaUserFriends></p></div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                <li onClick={() => publicUpdate(post?._id)}><a>Public</a></li>
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
                                <li onClick={() => friendUpdate(post?._id)}><a>User</a></li>
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
                                <li onClick={()=> deletePost(post?._id)}><a>Delete</a></li>
                            </ul>
                        </div>
                    </div>
                    {post.text ? <p className="p-5 text-lg font-medium text-gray-500">{post?.text}</p>
                        :
                        ''
                    }
                    {post.image ? <div className="border-2">
                        <img className="w-full md:h-[730px]" src={post?.image} alt="" />
                    </div>
                        :
                        ''
                    }
                    <div className="mt-4 px-5 flex items-center gap-3">
                        <p onClick={()=> likePost(post)} className="text-xl hover:text-red-500"><FaHeart></FaHeart></p>
                        {post.like ? <p className="font-bold text-gray-500">{post?.like} Like This Post</p>
                    :
                    <p>0 Like This Post</p>    
                    }
                    </div>
                </div>)
            }
        </div>
    );
};

export default UserAllPost;