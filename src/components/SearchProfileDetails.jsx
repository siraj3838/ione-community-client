import { useQuery } from "@tanstack/react-query";
import useAxios from "../Hook/useAxios";
import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import CreatePost from "../Pages/Profile/CreatePost";
import { FaFacebook, FaHeart, FaLinkedin, FaTwitter, FaUserLock } from "react-icons/fa6";
import { TbWorldCheck } from "react-icons/tb";
import { FaUserFriends } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import toast from "react-hot-toast";
import SendMessage from "./SendMessage";

const SearchProfileDetails = () => {
    const { user } = useContext(AuthContext);
    const [asc, setAsc] = useState(false)
    const { id } = useParams();
    const myAxios = useAxios();
    const { data: userDetails = {} } = useQuery({
        queryKey: ['searchUser', id],
        queryFn: async () => {
            const res = await myAxios.get('/users')
            const findUser = res?.data.find(us => us._id == id)
            return findUser;
        },
    })
    // console.log(userDetails);
    const { data: userPost = [], refetch } = useQuery({
        queryKey: ['poster', userDetails, asc],
        queryFn: async () => {
            const res = await myAxios.get(`/userPost?sort=${asc ? '' : 'asc'}`)
            const findUserPost = res.data.filter(us => us.email == userDetails?.email && us?.privacy != 'Private')
            return findUserPost;
        },
    })
    // console.log(userPost);
    


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


    return (
        <div>
            <div className="lg:relative w-full max-w-screen-xl mx-auto">
                {
                    userDetails?.banner ? <div onClick={() => document.getElementById('my_modal_4').showModal()} className="hero w-full" style={{ backgroundImage: `url(${userDetails?.banner?.banner})` }}>
                        <div className="hero-overlay bg-opacity-60"></div>
                        <div className="hero-content text-center text-neutral-content">
                            <div className="max-w-md py-28">


                            </div>
                        </div>
                    </div>
                        :
                        <div className="hero skeleton">
                            <div className="hero-overlay bg-opacity-60"></div>
                            <div className="hero-content text-center text-neutral-content">
                                <div className="max-w-md py-28">

                                </div>
                            </div>
                        </div>
                }
                {/* You can open the modal using document.getElementById('ID').showModal() method */}
                <dialog id="my_modal_4" className="modal">
                    <div className="modal-box w-11/12 max-w-5xl">
                        <img className="w-full h-[300px]" src={userDetails?.banner?.banner} alt="" />
                        <div className="modal-action">
                            <form method="dialog">
                                {/* if there is a button, it will close the modal */}
                                <button className="btn">Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
                <div className="grid lg:grid-cols-5 w-full gap-4 items-center lg:absolute lg:top-52 pt-3 lg:pt-0">
                    <div className="col-span-1 flex justify-center lg:flex-none">
                        <img className="rounded-full h-[200px] w-[200px] ml-16 md:ml-44 lg:ml-0" src={userDetails?.photoURL} alt="" />
                    </div>
                    <div className="col-span-3 ml-36 md:ml-80 lg:ml-0">
                        <div>
                            <h3 className="text-2xl font-semibold">{userDetails?.name}</h3>
                        </div>
                    </div>
                    <div className="col-span-1 flex items-center justify-end px-5">
                        {/* <button className="bg-[#45c363ec] hover:bg-[#4aa75fec] font-semibold hover:scale-110 duration-600 transition-all py-2 rounded-lg text-white px-2">Friend Request</button> */}
                        <SendMessage userDetails={userDetails}></SendMessage>
                    </div>
                </div>
            </div>
            <div className={`${userDetails.banner ? 'grid lg:grid-cols-4 gap-4 bg-slate-100 p-6 mt-3 lg:mt-36' : 'grid lg:grid-cols-4 gap-4 bg-slate-100 p-6 mt-3 lg:mt-44'}`}>
                <div className="col-span-1 p-3 bg-slate-50 min-h-screen rounded ml-10 md:ml-0 md:px-[235px] lg:px-5">
                    <h2 className="font-bold mb-4">About</h2>
                    {userDetails?.bio?.bio ? <>
                        <h4 className="mb-3 border-2 py-3 px-3">{userDetails?.bio?.bio}</h4>

                    </>
                        :
                        <h3>No Bio This Profile</h3>
                    }

                    <h2 className="font-bold my-4">Social Information</h2>
                    {/* facebook */}
                    {
                        userDetails?.facebookURL && userDetails?.twitterURL && userDetails?.linkedinURL ? <div className="space-y-2">
                            <a className="flex items-center gap-1" href={userDetails?.facebookURL}><FaFacebook className="text-xl"></FaFacebook> <span className="text-blue-700 underline">{userDetails?.facebookURL?.slice(0, 27)}</span></a>

                            <a className="flex items-center gap-1" href={userDetails?.twitterURL}><FaTwitter className="text-xl"></FaTwitter> <span className="text-blue-700 underline">{userDetails?.twitterURL?.slice(0, 27)}</span></a>

                            <a className="flex items-center gap-1" href={userDetails?.linkedinURL}><FaLinkedin className="text-xl"></FaLinkedin> <span className="text-blue-700 underline">{userDetails?.linkedinURL?.slice(0, 27)}</span></a>
                        </div>
                            :
                            <h3>No Social Link This Profile</h3>
                    }


                </div>
                <div className="col-span-3 p-3 bg-slate-50 min-h-screen rounded mt-36 md:mt-48 lg:mt-0">

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

                                </div>
                                    :
                                    ''
                                }
                                {
                                    post?.privacy == 'Friend' ? <div className="dropdown dropdown-end text-2xl absolute top-8 right-20 md:top-12 md:right-24">
                                        <div tabIndex={0} role="button" className=""><p><FaUserFriends></FaUserFriends></p></div>

                                    </div>
                                        :
                                        ''
                                }
                                {
                                    post?.privacy == 'Private' ? <div className="dropdown dropdown-end text-2xl absolute top-8 right-20 md:top-12 md:right-24">
                                        <div tabIndex={0} role="button" className=""><p><FaUserLock></FaUserLock></p></div>

                                    </div>
                                        :
                                        ''
                                }
                                <div className="text-2xl absolute top-8 right-10 md:top-12 md:right-10">
                                    <div className="dropdown dropdown-end">
                                        <div tabIndex={0} role="button" className=""><BsThreeDotsVertical></BsThreeDotsVertical></div>
                                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                            <li onClick={() => savePost(post)}><a>Save</a></li>
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
                                    <p onClick={() => likePost(post)} className="text-xl hover:text-red-500"><FaHeart></FaHeart></p>
                                    {post.like ? <p className="font-bold text-gray-500">{post?.like} Like This Post</p>
                                        :
                                        <p>0 Like This Post</p>
                                    }
                                </div>
                            </div>)
                        }
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SearchProfileDetails;