import { useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../Providers/AuthProvider";
import useAxios from "../Hook/useAxios";
import useMessage from "../Hook/useMessage";

// eslint-disable-next-line react/prop-types
const SendMessage = ({ userDetails }) => {
    const { user } = useContext(AuthContext);
    const myAxios = useAxios();
    const { email } = userDetails || {};
    const [allMessage, refetch] = useMessage();

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
        const messageInfo = {
            senderName: user?.displayName,
            senderEmail: user?.email,
            senderPhoto: user?.photoURL,
            message: message,
            receiverEmail: email
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
            <button className="bg-[#2c6be0ec] hover:bg-[#245dc7] font-semibold hover:scale-110 duration-600 transition-all py-2 rounded-lg text-white px-2" onClick={() => document.getElementById('my_modal_5').showModal()}>Message</button>
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <form onSubmit={sendMessageForm}>
                        <textarea name="message" id="" cols="30" rows="3" className="p-3 outline-none text-base w-full border-2 rounded-md mb-2" placeholder="Type your message"></textarea>
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
    );
};

export default SendMessage;