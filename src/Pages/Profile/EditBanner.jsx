import { useForm } from "react-hook-form";
import { FaRegEdit } from "react-icons/fa";
import useAxios from "../../Hook/useAxios";
import { useContext } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;


const EditBanner = () => {
    const { register, handleSubmit } = useForm()
    const myAxios = useAxios();
    const { user } = useContext(AuthContext);
    const { data: userProfile = {}, refetch } = useQuery({
        queryKey: ['banner', user?.email],
        queryFn: async () => {
            const res = await myAxios.get('/users')
            const findUser = res.data.find(us => us.email == user?.email)
            return findUser;
        }
    })
    const onSubmit = async (data) => {
        // console.log(data.banner[0].name)
        // reset();
        const imageFile = { image: data.image[0] }
        const resImage = await myAxios.post(image_hosting_api, imageFile, {
            headers: {
                "content-type": "multipart/form-data",
            }
        })
        // console.log(resImage.data.data.display_url);
        let banner = resImage.data.data.display_url;
        if (resImage.data.success) {
            myAxios.put(`/users/banner/update/${userProfile?._id}`, { banner })
                .then(res => {
                    console.log(res.data);
                    if (res.data.modifiedCount > 0) {
                        toast.success('Banner Updated')
                        refetch();
                    }
                })
        }

    }
    return (

        <div className="absolute -top-4 text-white">
            <button className="text-4xl flex items-center gap-2 hover:scale-110 duration-600 transition-all hover:text-green-500 " onClick={() => document.getElementById('my_modal_4').showModal()}><span><FaRegEdit></FaRegEdit></span> <span className="text-xl ">Change Cover Photo</span></button>
            <dialog id="my_modal_4" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <form onSubmit={handleSubmit(onSubmit)} className="font-medium">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Choose New Photo</span>
                            </label>
                            <input  {...register('image', { required: true })}
                                type="file" className="file-input w-full border-2 border-base-300 text-black" />

                        </div>
                        <div className="form-control mt-6">
                            <button type="submit" className="bg-[#2c6be0ec] hover:bg-[#245dc7] text-xl font-semibold hover:scale-110 duration-600 transition-all py-2 rounded-lg text-white">Update</button>
                        </div>
                    </form>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default EditBanner;