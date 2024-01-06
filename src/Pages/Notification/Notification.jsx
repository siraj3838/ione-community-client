import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../../Providers/AuthProvider";
import useAxios from "../../Hook/useAxios";
import { useQuery } from "@tanstack/react-query";
import useMessage from "../../Hook/useMessage";
import toast from "react-hot-toast";
import usePost from "../../Hook/usePost";

const Notification = () => {
    const [userPost] = usePost();
    const { user, loading } = useContext(AuthContext);
    const myAxios = useAxios();
    const { data: userProfile = {} } = useQuery({
        queryKey: ['banner', user?.email],
        enabled: !loading,
        queryFn: async () => {
            const res = await myAxios.get('/users')
            const findUser = res.data.find(us => us.email == user?.email)
            return findUser;
        },
    })

    return (
        <div>
            <Helmet>
                <title>Ione || Notification</title>
            </Helmet>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5 lg:pt-16 md:pt-48 px-5 lg:px-2">
                <div className="lg:col-span-1 md:col-span-1 my-5 md:top-14 md:z-30 md:pt-10 lg:pt-0 lg:top-16 md:fixed">
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
                                    ''
                            }
                        </div>
                    </div>


                </div>
                <div className="col-span-4 md:ml-[330px] md:-mt-10 lg:mt-5 min-h-screen space-y-3">
                    {
                        userPost.map(post => <div className="flex gap-6 bg-blue-200 rounded-tl-full rounded-bl-full" key={post._id}>
                            <img className="h-24 w-24 rounded-full" src={post?.photo} alt="" />
                            <div className="space-y-1 mt-1 flex-1">
                                <div className="chat chat-start">
                                    <div className="chat-bubble"><p>{post?.text}</p></div>
                                </div>
                                <h2 className="text-sm font-bold text-gray-600">{post?.time}</h2>
                            </div>
                            <div className="flex items-center px-1 md:gap-16">
                                <div>
                                    <img className="w-20 h-20" src={post?.image} alt="" />
                                </div>
                                <div className="px-6 py-3 lg:py-4 rounded-tr-full rounded-bl-full bg-accent font-semibold">
                                    <h2>Post Done</h2>
                                </div>
                            </div>
                        </div>)
                    }
                </div>
            </div>
        </div>
    );
};

export default Notification;