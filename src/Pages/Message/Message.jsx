import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../../Providers/AuthProvider";
import useAxios from "../../Hook/useAxios";
import { useQuery } from "@tanstack/react-query";
import useMessage from "../../Hook/useMessage";
import toast from "react-hot-toast";

const Message = () => {
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
    const [allMessage, refetch] = useMessage();
    // console.log(allMessage);

    const sendMessageForm = e => {
        toast.success('Please Wait Message Are Pending', {
            style: {
                border: '1px solid #713200',
                padding: '16px',
                color: '#713200',
            },
            iconTheme: {
                primary: '#713200',
                secondary: '#FFFAEE',
            },
        });
        e.preventDefault();
        const form = e.target;
        const message = form.message.value;
        const receiver = form.receiver.value;
        const messageInfo = {
            senderName: user?.displayName,
            senderEmail: user?.email,
            senderPhoto: user?.photoURL,
            message: message,
            receiverEmail: receiver
        }
        // console.log(messageInfo);
        myAxios.post('/messages', messageInfo)
            .then(res => {
                if (res.data.insertedId) {
                    toast.success('Message Send Successfully')
                    refetch()
                }
            })
    }

    return (
        <div>
            <Helmet>
                <title>Ione || Message</title>
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
                        allMessage.map(message => <div className="flex gap-6 bg-blue-200 rounded-tl-full rounded-bl-full" key={message._id}>
                            <img className="h-28 w-28 rounded-full" src={message?.senderPhoto} alt="" />
                            <div className="space-y-1 mt-2 flex-1">
                                <h2 className="text-lg font-bold text-gray-600">{message?.senderName}</h2>
                                <div className="chat chat-start">
                                    <div className="chat-bubble chat-bubble-accent"><p>{message?.message}</p></div>
                                </div>
                            </div>
                            <div className="flex items-center px-3">
                                <button className="bg-[#2c6be0ec] hover:bg-[#245dc7] font-semibold hover:scale-110 duration-600 transition-all py-2 rounded-lg text-white px-2" onClick={() => document.getElementById('my_modal_5').showModal()}>Reply</button>
                                <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                                    <div className="modal-box">
                                        <form onSubmit={sendMessageForm}>
                                            <textarea name="message" id="" cols="30" rows="3" className="p-3 outline-none text-base w-full border-2 rounded-md mb-2" placeholder="Type your message"></textarea>
                                            <input type="text" name="receiver" hidden defaultValue={message?.senderEmail} />
                                            <button type="submit" className="bg-[#2c6be0ec] hover:bg-[#245dc7] text-lg font-semibold hover:scale-110 duration-600 transition-all py-2 rounded-lg text-white w-full">Send</button>
                                        </form>
                                        <div className="modal-action">
                                            <form method="dialog">
                                                <button className="btn">Cancel</button>
                                            </form>
                                        </div>
                                    </div>
                                </dialog>
                            </div>
                        </div>)
                    }
                </div>
            </div>
        </div>
    );
};

export default Message;