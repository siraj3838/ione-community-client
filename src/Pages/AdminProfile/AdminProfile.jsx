import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { FaLinkedin, FaPlus } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoIosAddCircle } from "react-icons/io";
import { FaTwitter, FaUserEdit } from "react-icons/fa";
import { MdOutlineNoteAlt } from "react-icons/md";
import { LiaNotesMedicalSolid } from "react-icons/lia";
import { FaFacebook } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { FaArrowTurnDown } from "react-icons/fa6";
import { FaLevelUpAlt } from "react-icons/fa";
import { AuthContext } from "../../Providers/AuthProvider";
import useAxios from "../../Hook/useAxios";
import useSavePost from "../../Hook/useSavePost";
import EditBanner from "../Profile/EditBanner";
import UsersSavePost from "../Profile/UsersSavePost";
import AdminCreatePost from "./AdminCreatePost";


const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;


const AdminProfile = () => {
    const [upInput, setUpInput] = useState(false);
    const [upSave, setUpSave] = useState(false);
    const { user, resetPassword, loading } = useContext(AuthContext);
    const myAxios = useAxios();
    const [savePost] = useSavePost();
    const { data: userProfile = {}, refetch } = useQuery({
        queryKey: ['banner', user?.email],
        enabled: !loading,
        queryFn: async () => {
            const res = await myAxios.get('/users')
            const findUser = res.data.find(us => us.email == user?.email)
            return findUser;
        },
    })
    // console.log(userProfile.bio.bio);

    const { register, handleSubmit } = useForm()
    const onSubmit = async (data) => {
        // console.log(data.banner[0].name)
        // reset();
        toast.success('Please Wait Banner Post Are Pending', {
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
        const imageFile = { image: data.image[0] }
        const resImage = await myAxios.post(image_hosting_api, imageFile, {
            headers: {
                "content-type": "multipart/form-data",
            }
        })
        // console.log(resImage.data.data.display_url);
        let banner = resImage.data.data.display_url;
        if (resImage.data.success) {
            myAxios.put(`/users/banner/${userProfile?._id}`, { banner })
                .then(res => {
                    console.log(res.data);
                    if (res.data.modifiedCount > 0) {
                        toast.success('Banner Uploaded')
                        refetch();
                    }
                })
        }

    }

    const resetPasswordHandle = () => {
        resetPassword(user?.email)
            .then(() => {
                toast.success('Check Your mail link Already send')
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const downInput = () => {
        setUpInput(true)
    }
    const addBioProfile = e => {
        e.preventDefault();
        const form = e.target;
        const bio = form.bio.value;

        myAxios.put(`/users/bio/${userProfile?._id}`, { bio })
            .then(res => {
                console.log(res.data);
                if (res.data.modifiedCount > 0) {
                    toast.success('Bio Set Successfully')
                    refetch();
                }
            })
    }

    const editBioHandle = e => {
        e.preventDefault();
        const form = e.target;
        const bio = form.changeBioAgain.value;

        myAxios.put(`/users/bio/edit/${userProfile?._id}`, { bio })
            .then(res => {
                console.log(res.data);
                if (res.data.modifiedCount > 0) {
                    toast.success('Bio Updated')
                    refetch();
                }
            })
    }

    // facebookURL
    const addFacebookURLHandle = e => {
        e.preventDefault();
        const form = e.target;
        const facebookURL = form.facebookURL.value;
        const twitterURL = form.twitterURL.value;
        const linkedinURL = form.linkedinURL.value;
        const socialInfo = { facebookURL, twitterURL, linkedinURL }

        myAxios.put(`/users/facebook/${userProfile?._id}`, socialInfo)
            .then(res => {
                console.log(res.data);
                if (res.data.modifiedCount > 0) {
                    toast.success('Social URL Added Successfully')
                    refetch();
                }
            })
    }


    return (
        <div className="pt-48 md:pt-20 max-w-screen-xl mx-auto">
            <div className="lg:relative w-full">
                {
                    userProfile?.banner ? <div className="hero w-full" style={{ backgroundImage: `url(${userProfile?.banner?.banner})` }}>
                        <div className="hero-overlay bg-opacity-60"></div>
                        <div className="hero-content text-center text-neutral-content">
                            <div className="max-w-md py-40">


                            </div>
                        </div>
                    </div>
                        :
                        <div className="hero skeleton md:mt-16 lg:mt-0">
                            <div className="hero-overlay bg-opacity-60"></div>
                            <div className="hero-content text-center text-neutral-content">
                                <div className="max-w-md py-20">
                                    <button className="text-5xl border-2 p-3" onClick={() => document.getElementById('my_modal_4').showModal()}><FaPlus></FaPlus></button>
                                    <dialog id="my_modal_4" className="modal modal-bottom sm:modal-middle">
                                        <div className="modal-box">
                                            <form onSubmit={handleSubmit(onSubmit)} className="font-medium">
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text text-base-200">Photo</span>
                                                    </label>
                                                    <input  {...register('image', { required: true })}
                                                        type="file" className="file-input w-full border-2 border-base-300" />

                                                </div>
                                                <div className="form-control mt-6">
                                                    <button type="submit" className="bg-[#2c6be0ec] hover:bg-[#245dc7] text-xl font-semibold hover:scale-110 duration-600 transition-all py-2 rounded-lg text-white">Upload</button>
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
                            </div>
                        </div>
                }
                <div className="grid lg:grid-cols-5 gap-4 items-center lg:absolute lg:top-52 pt-3 lg:pt-0">
                    <div className="col-span-1 flex justify-center lg:flex-none">
                        <img className="rounded-full h-[200px] w-[200px] ml-16 md:ml-44 lg:ml-0" src={user?.photoURL} alt="" />
                    </div>
                    <div className="col-span-3 ml-36 md:ml-80 lg:ml-0">
                        <div>
                            <h3 className="text-2xl font-semibold">{user?.displayName}</h3>
                            {userProfile?.friends ? <p>{userProfile?.friends} friends</p>
                                :
                                <p>0 friends</p>}
                        </div>
                    </div>
                    <div className="col-span-1 ml-28 md:ml-72 lg:ml-9">
                        <div className="">
                            <p onClick={resetPasswordHandle} className="flex items-center gap-3 text-xl cursor-pointer hover:scale-110 duration-600 transition-all hover:text-red-800"><FaUserEdit className="text-3xl"></FaUserEdit> Password Change</p>
                        </div>
                        <EditBanner></EditBanner>
                    </div>
                </div>
            </div>
            <div className="grid lg:grid-cols-4 gap-4 bg-slate-100 p-6 mt-3 lg:mt-44">
                <div className="md:col-span-1 w-full p-3 bg-slate-50 min-h-screen rounded ml-10 md:ml-0 md:px-[235px] lg:px-5">
                    <h2 className="font-bold mb-4">About</h2>
                    {userProfile?.bio?.bio ? <>
                        <h4 className="mb-3 border-2 py-3 px-3">{userProfile?.bio?.bio}</h4>
                        <button className="font-semibold flex items-center gap-2" onClick={() => document.getElementById('my_modal_3').showModal()}><span className="text-2xl"><LiaNotesMedicalSolid></LiaNotesMedicalSolid></span> Edit Bio</button>
                        <dialog id="my_modal_3" className="modal">
                            <div className="modal-box">
                                <form method="dialog">
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <form onSubmit={editBioHandle}>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-black text-xl">Edit Bio</span>
                                        </label>
                                        <input type="text" {...register("changeBioAgain",)}
                                            defaultValue={userProfile?.bio?.bio} className="input input-bordered border-2 border-base-300 text-black" />
                                    </div>
                                    <div className="form-control mt-6">
                                        <button type="submit" className="bg-[#2c6be0ec] hover:bg-[#245dc7] text-xl font-semibold hover:scale-110 duration-600 transition-all py-2 rounded-lg text-white">Edit</button>
                                    </div>
                                </form>
                            </div>
                        </dialog>
                    </>
                        :
                        <form onSubmit={addBioProfile}>
                            <textarea className={`${upInput ? 'textarea textarea-primary w-[270px] absolute top-[590px] duration-700' : 'textarea textarea-primary w-[270px] absolute -top-96'}`} placeholder="type Bio" name="bio"></textarea>
                            {
                                upInput ? <div className="flex justify-end mt-24">
                                    <button type="submit" onClick={downInput} className="bg-white font-semibold p-1 rounded">Set Bio</button>
                                </div>
                                    :
                                    <button onClick={downInput} className="bg-white py-1 px-2 rounded flex items-center gap-2"><span className="text-2xl"><MdOutlineNoteAlt></MdOutlineNoteAlt></span> Add Bio</button>
                            }
                        </form>}

                    <h2 className="font-bold my-4">Social Information</h2>
                    {/* facebook */}
                    {
                        userProfile?.facebookURL && userProfile?.twitterURL && userProfile?.linkedinURL ? <div className="space-y-2">
                            <a className="flex items-center gap-1" href={userProfile?.facebookURL}><FaFacebook className="text-xl"></FaFacebook> <span className="text-blue-700 underline">{userProfile?.facebookURL?.slice(0, 27)}</span></a>

                            <a className="flex items-center gap-1" href={userProfile?.twitterURL}><FaTwitter className="text-xl"></FaTwitter> <span className="text-blue-700 underline">{userProfile?.twitterURL?.slice(0, 27)}</span></a>

                            <a className="flex items-center gap-1" href={userProfile?.linkedinURL}><FaLinkedin className="text-xl"></FaLinkedin> <span className="text-blue-700 underline">{userProfile?.linkedinURL?.slice(0, 27)}</span></a>
                        </div>
                            :
                            <form onSubmit={addFacebookURLHandle} className="space-y-2">
                                <input type="text" placeholder="Facebook URL" className="py-1 px-2 w-full" name="facebookURL" />
                                <input type="text" placeholder="Twitter URL" className="py-1 px-2 w-full" name="twitterURL" />
                                <input type="text" placeholder="Linkedin URL" className="py-1 px-2 w-full" name="linkedinURL" />
                                <div className="flex justify-end">
                                    <button type="submit" className="text-2xl hover:scale-110 duration-600 transition-all"><IoIosAddCircle></IoIosAddCircle></button>
                                </div>
                            </form>
                    }

                    <div className="relative">
                        <ul className="menu px-4 mt-5 rounded-md">
                            <li onClick={() => setUpSave(!upSave)}>
                                <NavLink
                                    className={({ isActive, isPending }) =>
                                        isPending ? "pending" : isActive ? "border-b-2 hover:scale-110 transition-all text-xl font-semibold hover:text-[#2c6be0ec] cursor-pointer border-b-[#2c6be0ec] text-[#2c6be0ec] flex justify-center" : " border-b-2 hover:scale-110 transition-all text-xl font-semibold hover:text-[#2c6be0ec] cursor-pointer border-b-[#2c6be0ec] text-[#2c6be0ec] flex justify-center"
                                    }
                                >
                                    {
                                        upSave ? <span className="flex items-center gap-1">Saved Post <FaLevelUpAlt></FaLevelUpAlt></span>
                                            :
                                            <span className="flex items-center gap-1">Saved Post <FaArrowTurnDown></FaArrowTurnDown></span>
                                    }
                                </NavLink>

                            </li>
                        </ul>
                        <div className={`${upSave ? 'bg-slate-200 py-4 px-2 absolute top-[70px] duration-700' : 'bg-blue-300 py-4 px-2 absolute -top-[2050px] duration-1000'}`}>
                            {
                                savePost.length ? <UsersSavePost></UsersSavePost>
                                    :
                                    <div className="px-8">
                                        <h2 className="text-center text-xl font-semibold">You Can not Save Any Post !!!</h2>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="col-span-3 p-3 bg-slate-50 min-h-screen rounded mt-36 md:mt-0 lg:mt-0">
                    <AdminCreatePost></AdminCreatePost>
                </div>
            </div>

        </div>
    );
};

export default AdminProfile;