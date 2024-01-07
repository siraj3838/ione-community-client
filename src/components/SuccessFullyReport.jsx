import useSuccess from "../Hook/useSuccess";

const SuccessFullyReport = () => {
    const [userReportSuccess, refetch] = useSuccess();
    console.log(userReportSuccess);
    return (
        <div className="space-y-3">
            {
                        userReportSuccess.map(post => <div className="flex lg:gap-6 bg-blue-200 rounded-tl-full rounded-bl-full" key={post._id}>
                            <img className="h-24 w-24 rounded-full" src={post?.posterPhoto} alt="" />
                            <div className="space-y-1 mt-1 flex-1">
                                <div className="chat chat-start">
                                    <div className="chat-bubble"><p>{post?.posterText}</p></div>
                                </div>
                                <h2 className="text-sm font-bold text-gray-600 hidden lg:block">{post?.successTime}</h2>
                            </div>
                            <div className="flex items-center px-1 lg:gap-16">
                                <div>
                                    {
                                        post?.posterImage ?
                                        <img className="w-20 h-20" src={post?.posterImage} alt="" />
                                    :
                                    ''
                                    }
                                </div>
                                <div className="flex items-center px-3">
                                   <img className="w-10" src="https://i.ibb.co/M7zkmhh/images-11-removebg-preview.png" alt="" />
                                </div>
                            </div>
                        </div>)
                    }
        </div>
    );
};

export default SuccessFullyReport;