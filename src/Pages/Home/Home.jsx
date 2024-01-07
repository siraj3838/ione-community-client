import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../../Providers/AuthProvider";
import useAxios from "../../Hook/useAxios";
import { useQuery } from "@tanstack/react-query";
import { TbWorldCheck } from "react-icons/tb";
import { FaUserFriends, FaUserSecret } from "react-icons/fa";
import { FaHeart, FaUserLock } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import useAdminPost from "../../Hook/useAdminPost";

const Home = () => {
    const { user, loading } = useContext(AuthContext);
    const myAxios = useAxios();
    const [asc, setAsc] = useState(false)
    const [adminPost] = useAdminPost();
    // const [publicPost, setPublicPost] = useState([])
    const navigate = useNavigate();
    const { data: userProfile = {} } = useQuery({
        queryKey: ['banner', user?.email],
        enabled: !loading,
        queryFn: async () => {
            const res = await myAxios.get('/users')
            const findUser = res.data.find(us => us.email == user?.email)
            return findUser;
        },
    })

    const { data: currentUser = {} } = useQuery({
        queryKey: ['current', user?.email],
        enabled: !loading,
        queryFn: async () => {
            const res = await myAxios.get('/userPosts')
            const findUser = res.data.find(us => us.email == user?.email)
            return findUser;
        },
    })

    // console.log(currentUser);
    const { data: allPosts = [], refetch } = useQuery({
        queryKey: ['allPost', user?.email, asc],
        queryFn: async () => {
            const res = await myAxios.get(`/userPost?sort=${asc ? '' : 'asc'}`)
            const findUserPost = res.data.filter(us => us.privacy !== 'Private')
            return findUserPost;
        },
    })
    const { data: notUserPost = [] } = useQuery({
        queryKey: ['notUser', user?.email, asc],
        queryFn: async () => {
            const res = await myAxios.get(`/userPost?sort=${asc ? '' : 'asc'}`)
            const findUserPost = res.data.filter(us => us.privacy == 'Public')
            return findUserPost;
        },
    })

    const likePost = (post) => {
        const like = parseInt(post?.like)
        const likes = { like }
        myAxios.put(`/userPost/like/${post?._id}`, likes)
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    toast.success('Thank You for Like')
                    refetch();
                }
            })
    }


    const likePostNoUser = (id) => {
        toast.error('Sorry Please Login Now')
        navigate('/login')
    }


    const savePost = (post) => {
        let thisPost = {
            image: post.image || '',
            name: post?.name,
            email: post?.email,
            privacy: post.privacy,
            text: post?.text,
            time: post?.time,
            photo: post?.photo,
            like: post.like,
            currentEmail: user?.email

        }
        myAxios.post('/savePosts', thisPost)
            .then(res => {
                if (res.data.insertedId) {
                    toast.success('This Post Saved Your Profile')
                }
            })
        // console.log(post);
    }


    const reportPost = (post) => {
        const report = 'report';
        const reports = { report }
        myAxios.put(`/userPost/report/${post?._id}`, reports)
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    toast.success('Your Report Are Send Admin')
                    refetch();
                }
            })
    }

    return (
        <div>
            <Helmet>
                <title>Ione Community || Home</title>
            </Helmet>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5 lg:pt-16 md:pt-48 px-5 lg:px-2">
                <div className="lg:col-span-1 md:col-span-1 my-5 md:top-14 md:z-30 pt-6 md:pt-10 lg:pt-0 lg:top-16 md:fixed">
                    <div className='w-full'>
                        <div className="relative hidden md:block">
                            {
                                userProfile?.banner ? <div className="hero" style={{ backgroundImage: `url(${userProfile?.banner?.banner})` }}>
                                    <div className="hero-overlay bg-opacity-60"></div>
                                    <div className="hero-content text-center text-neutral-content">
                                        <div className="lg:max-w-md py-20">


                                        </div>
                                    </div>
                                </div>
                                    :
                                    <div className="hero skeleton w-[288px]">
                                        <div className="hero-overlay bg-opacity-60"></div>
                                        <div className="hero-content text-center text-neutral-content">
                                            <div className="lg:max-w-md py-20 px-32">

                                            </div>
                                        </div>
                                    </div>
                            }
                            <div className="absolute md:-bottom-16 lg:-bottom-12 left-24">
                                {user ? <img className="w-28 h-28 rounded-full" src={user?.photoURL} alt="" />
                                    :
                                    <img className="w-28 h-28 bg-slate-700 rounded-full" alt="User-Photo" src="https://i.ibb.co/ZWKSncC/default-avatar-removebg-preview.png" />
                                }
                            </div>
                        </div>
                        <div className="bg-white pb-5 md:py-[70px] lg:py-14 text-center px-5 mb-5 w-[288px]">
                            {
                                user ? <>
                                    <h2 className="text-lg font-medium text-gray-600">{user?.displayName}</h2>
                                    <hr className="my-1" />
                                    <p className="text-sm text-gray-500 font-medium">{userProfile?.bio?.bio}</p>
                                </>
                                    :
                                    <div className="">
                                        <h3 className="text-lg mb-3">Please Login Here</h3>
                                        <Link to={'/login'}>
                                            <div className="px-48">
                                                <button className="hover:scale-110 transition-all text-base-200 font-bold bg-blue-400 px-3 py-1.5 rounded-md -ml-32">Login</button>
                                            </div>
                                        </Link>
                                    </div>
                            }
                        </div>
                    </div>


                </div>
                <div className="col-span-3 md:ml-[310px] md:-mt-10 lg:-mt-0">
                    {
                        user ? <>
                            {
                                allPosts.map(post => <div className="m-5 p-5 bg-white relative" key={post._id}>
                                    <div className="flex bg-slate-100 w-full p-2 rounded-tl-full rounded-bl-full items-center gap-4">
                                        <img className="w-16 h-16 rounded-full" src={post?.photo} alt="" />
                                        <div className="">
                                            <h1 className="text-xl font-medium">{post?.name}</h1>
                                            <h2 className="text-gray-500">{post?.time.slice(5,)}</h2>
                                        </div>
                                    </div>
                                    {post?.privacy == 'Public' ? <div className="dropdown dropdown-end text-2xl absolute top-12 right-24">
                                        <div tabIndex={0} role="button" className=""><p className=""><TbWorldCheck></TbWorldCheck></p></div>
                                    </div>
                                        :
                                        ''
                                    }
                                    {
                                        post?.privacy == 'Friend' ? <div className="dropdown dropdown-end text-2xl absolute top-12 right-24">
                                            <div tabIndex={0} role="button" className=""><p><FaUserFriends></FaUserFriends></p></div>

                                        </div>
                                            :
                                            ''
                                    }
                                    {
                                        post?.privacy == 'Private' ? <div className="dropdown dropdown-end text-2xl absolute top-12 right-24">
                                            <div tabIndex={0} role="button" className=""><p><FaUserLock></FaUserLock></p></div>
                                        </div>
                                            :
                                            ''
                                    }
                                    <div className="text-2xl absolute top-12 right-10">
                                        <div className="dropdown dropdown-end">
                                            <div tabIndex={0} role="button" className=""><BsThreeDotsVertical></BsThreeDotsVertical></div>
                                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                                <li onClick={() => savePost(post)}><a>Save</a></li>
                                                {
                                                    post?.report == 'report' ? <li><a>Report Pending</a></li>
                                                        :
                                                        <li onClick={() => reportPost(post)}><a>Report</a></li>
                                                }
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
                                    <div className="flex px-5 mt-4 items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <p onClick={() => likePost(post)} className="text-xl hover:text-red-500"><FaHeart></FaHeart></p>
                                            {post.like ? <p className="font-bold text-gray-500">{post?.like} Like This Post</p>
                                                :
                                                <p>0 Like This Post</p>
                                            }
                                        </div>
                                        {/* <p className="font-bold text-gray-500 cursor-pointer">Comment</p> */}
                                    </div>
                                </div>)
                            }
                        </>
                            :
                            <>
                                {
                                    notUserPost.map(post => <div className="m-5 p-5 bg-white relative" key={post._id}>
                                        <div className="flex bg-slate-100 w-full p-2 rounded-tl-full rounded-bl-full items-center gap-4">
                                            <img className="w-16 h-16 rounded-full" src={post?.photo} alt="" />
                                            <div className="">
                                                <h1 className="text-xl font-medium">{post?.name}</h1>
                                                <h2 className="text-gray-500">{post?.time.slice(5,)}</h2>
                                            </div>
                                        </div>
                                        {post?.privacy == 'Public' ? <div className="dropdown dropdown-end text-2xl absolute top-12 right-24">
                                            <div tabIndex={0} role="button" className=""><p className=""><TbWorldCheck></TbWorldCheck></p></div>

                                        </div>
                                            :
                                            ''
                                        }
                                        {
                                            post?.privacy == 'Friend' ? <div className="dropdown dropdown-end text-2xl absolute top-12 right-24">
                                                <div tabIndex={0} role="button" className=""><p><FaUserFriends></FaUserFriends></p></div>

                                            </div>
                                                :
                                                ''
                                        }
                                        {
                                            post?.privacy == 'Private' ? <div className="dropdown dropdown-end text-2xl absolute top-12 right-24">
                                                <div tabIndex={0} role="button" className=""><p><FaUserLock></FaUserLock></p></div>

                                            </div>
                                                :
                                                ''
                                        }
                                        <div className="text-2xl absolute top-12 right-10">
                                            <div className="dropdown dropdown-end">
                                                <div onClick={() => likePostNoUser(post?._id)} className=""><BsThreeDotsVertical></BsThreeDotsVertical></div>

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
                                            <p onClick={() => likePostNoUser(post?._id)} className="text-xl hover:text-red-500"><FaHeart></FaHeart></p>
                                            {post.like ? <p className="font-bold text-gray-500">{post?.like} Like This Post</p>
                                                :
                                                <p>0 Like This Post</p>
                                            }
                                        </div>
                                    </div>)
                                }
                            </>
                    }
                </div>
                <div className="col-span-1 mt-5">
                    <h3 className="text-2xl border-b-2 border-black pb-2 mb-3">Latest Job Post</h3>
                    <div className="space-y-3">
                        {
                            adminPost.map(aPost => <div className="border-2 shadow-md bg-white" key={aPost._id}>
                                <Link to={`${aPost?.jobUrl}`} target="_blank">
                                    <div className="flex gap-2">
                                        <img className="w-40 h-24" src={aPost.image} alt="" />
                                        <div className="space-y-2 mt-1">
                                            <h2 className="text-gray-500">{aPost?.time.slice(5,)}</h2>
                                            <div className="flex justify-center">
                                                <Link to={`${aPost?.jobUrl}`} target="_blank">
                                                    <button className="hover:scale-110 transition-all text-base-200 font-bold bg-blue-400 px-3 py-1.5 rounded-md">Visit</button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;