import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../Providers/AuthProvider";
import useAxios from "../../Hook/useAxios";
import SocialLogin from "../../Shared/SocialLogin";
import { Helmet } from "react-helmet-async";



const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;


const Register = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const { createUser, updateUserProfile } = useContext(AuthContext)
    const navigate = useNavigate();
    const myAxios = useAxios();


    const onSubmit = async (data) => {
        console.log(data)
        // reset();
        const imageFile = { image: data.image[0] }
        const resImage = await myAxios.post(image_hosting_api, imageFile, {
            headers: {
                "content-type": "multipart/form-data",
            }
        })
        // console.log(resImage.data.data.display_url);
        if (resImage.data.success) {
            createUser(data.email, data.password)
                .then(res => {
                    const loggedUser = res.user;
                    console.log(loggedUser);
                    updateUserProfile(data.name, resImage.data.data.display_url)
                        .then(() => {
                            const userInfo = { name: data?.name, email: data?.email, photoURL: resImage.data.data.display_url }
                            navigate('/');
                            reset();
                            toast.success('Register Successfully')
                            myAxios.post('/users', userInfo)
                                .then(res => {
                                    console.log(res);
                                })

                        })
                        .catch(err => {
                            console.log(err);
                        })


                })
                .catch(err => {
                    console.log(err);
                })
        }

    }

    return (
        <>
        <Helmet>
                <title>Ione || Register</title>
            </Helmet>
            <div className="hero pt-14" style={{ backgroundImage: 'url(https://i.ibb.co/WBMzkQp/il-570x-N-2165453297-kt6q.jpg)' }}>
                <div className="hero-overlay bg-opacity-90"></div>
                <div className="lg:ml-[600px] lg:mt-4">
                    <div className="py-2">
                        <div className="px-10 py-2 border-4 rounded-md shadow-2xl">
                            <form onSubmit={handleSubmit(onSubmit)} className="font-medium">
                                <h3 className="text-accent text-center text-3xl font-bold">Create Account</h3>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-base-200">Full Name</span>
                                    </label>
                                    <input type="text" {...register("name", { required: true })} placeholder="Enter Your Name" className="input input-bordered border-2 border-base-300" />
                                    {errors.name && <span className="text-red-600">Name is required</span>}
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-base-200">Email</span>
                                    </label>
                                    <input type="email" {...register("email", { required: true })} placeholder="Enter Your Email" className="input input-bordered border-2 border-base-300" />
                                    {errors.email && <span className="text-red-600">Email is required</span>}
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-base-200">Photo</span>
                                    </label>
                                    <input  {...register('image', { required: true })}
                                        type="file" className="file-input w-full border-2 border-base-300" />
                                    {errors.photoURL && <span className="text-red-600">Photo URL is required</span>}
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-base-200">Password</span>
                                    </label>
                                    <input type="password" {...register("password", {
                                        required: true,
                                        minLength: 6,
                                        pattern: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/
                                    })} placeholder=" Enter Strong password" className="input input-bordered border-2 border-base-300" />
                                    {errors.password?.type === "required" &&
                                        <p className="text-red-600">Password is required</p>}
                                    {errors.password?.type === "minLength" &&
                                        <p className="text-red-600">Password minimum 6 characters</p>}
                                    {errors.password?.type === "pattern" &&
                                        <p className="text-red-600">Password must have one uppercase case and one number and spacial characters</p>}

                                </div>
                                <div className="form-control mt-6">
                                    <button type="submit" className="bg-[#2c6be0ec] hover:bg-[#245dc7] text-xl font-semibold hover:scale-110 duration-600 transition-all py-2 rounded-lg text-white">Register</button>
                                </div>
                            </form>
                            <SocialLogin></SocialLogin>
                            <p className="text-center my-3 text-accent"> <span className="opacity-80 mr-2">Already have an account? Please</span> <Link to={'/login'} className="hover:text-lime-400 text-lg font-semibold">Login</Link></p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Register;