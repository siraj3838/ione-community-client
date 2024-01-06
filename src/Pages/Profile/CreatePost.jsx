import { useForm } from "react-hook-form";
import useAxios from "../../Hook/useAxios";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import moment from "moment/moment";
import UserAllPost from "./UserAllPost";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const CreatePost = () => {
    const myAxios = useAxios();
    const { register, handleSubmit, reset } = useForm();
    const [asc, setAsc] = useState(false)
    const { user } = useContext(AuthContext);
    const { data: userPost = [], refetch } = useQuery({
        queryKey: ['posts', user?.email, asc],
        queryFn: async () => {
            const res = await myAxios.get(`/userPost?sort=${asc ? '' : 'asc'}`)
            const findUserPost = res.data.filter(us => us.email == user?.email)
            return findUserPost;
        },
    })
    const onSubmit = async (data) => {
        // console.log(data.banner[0].name)
        // reset();
        toast.success('Please Wait Post Are Pending', {
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
         let userPosts = {
            name: user?.displayName,
            email: user?.email,
            privacy: data.privacy,
            text: data.text,
            time: data.time,
            photo: user?.photoURL,
            like: data?.like

        }
        if(data.image.length == 0){
            myAxios.post('/userPost', userPosts)
                .then(res => {
                    // console.log(res);
                    if (res.data.insertedId) {
                        toast.success('Your Post Successfully Upload')
                        refetch();
                        reset();
                    }
                })
        }
        const imageFile = { image: data.image[0] }
        const resImage = await myAxios.post(image_hosting_api, imageFile, {
            headers: {
                "content-type": "multipart/form-data",
            }
        })
        // console.log(resImage.data.data.display_url);
        let image = resImage.data.data.display_url;
        let userPost = {
            image: image,
            name: user?.displayName,
            email: user?.email,
            privacy: data.privacy,
            text: data.text,
            time: data.time,
            photo: user?.photoURL,
            like: data?.like

        }
        
        if (resImage.data.success) {
            myAxios.post('/userPost', userPost)
                .then(res => {
                    if (res.data.insertedId) {
                        toast.success('Your Post Successfully Upload')
                        refetch();
                        reset();
                    }
                })
        }

    }
    
    
    // console.log(userPost);
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="font-medium max-w-screen-sm mx-auto border-2 p-4">
                <div className="flex items-center gap-2">
                    <div>
                        <Link to={'/profile'}>
                            <img className="w-12 h-12 rounded-full hover:scale-110 duration-600 transition-all" src={user?.photoURL} alt="" />
                        </Link>
                    </div>
                    <select {...register('privacy', { required: true })} className="select select-bordered join-item">
                        <option disabled value={'default'}>Privacy</option>
                        <option>Public</option>
                        <option>Friend</option>
                        <option>Private</option>
                    </select>
                </div>
                <div className="hidden">
                    <input type="text" className="" {...register('time', { required: true })} value={moment().format("YYYY-MM-DD, h:mm a")} id="" />
                </div>
                <div className="form-control">
                    <textarea {...register("text", )} id="" cols="30" rows="5" className="p-3 outline-none text-xl" placeholder="What's on Your Mind?"></textarea>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-base-200">Photo</span>
                    </label>
                    <input  {...register('image')}
                        type="file" className="file-input w-full border-2 border-base-300" />

                </div>
                <div className="form-control hidden">
                    <label className="label">
                        <span className="label-text text-base-200">Photo</span>
                    </label>
                    <input  {...register('like')}
                        type="number" defaultValue={0} className="file-input w-full border-2 border-base-300" />

                </div>
                <div className="flex justify-end">
                    <div className="mt-6 w-40">
                        <button type="submit" className="bg-[#2c6be0ec] hover:bg-[#245dc7] text-lg font-semibold hover:scale-110 duration-600 transition-all py-2 rounded-lg text-white w-full">Add To Your Post</button>
                    </div>
                </div>
            </form>
            <div className="divider py-5"></div>
            <div>
                 <UserAllPost></UserAllPost>
            </div>
        </div>
    );
};

export default CreatePost;