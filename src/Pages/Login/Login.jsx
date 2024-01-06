
// import GoogleLogin from "../../Shared/GoogleLogin";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../Providers/AuthProvider";
import SocialLogin from "../../Shared/SocialLogin";
import { Helmet } from "react-helmet-async";

const Login = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const { loggedInUser } = useContext(AuthContext)
    const navigate = useNavigate();
    const [passwordError, setPasswordError] = useState('');


    const onSubmit = (data) => {
        // console.log(data)
        // reset();
        setPasswordError('');
        loggedInUser(data.email, data.password)
            .then(res => {
                console.log(res.user);
                toast.success('Login Successfully')

                navigate(location?.state ? location.state : '/');
                reset();
            })
            .catch(err => {
                console.log(err);
                setPasswordError(err.message)
            })
    }
    return (
        <div className="pt-14">
            <Helmet>
                <title>Ione || Login</title>
            </Helmet>
            <div className="hero" style={{ backgroundImage: 'url(https://i.ibb.co/kQFcWKp/Screenshot-2024-01-03-121144.png)' }}>
                <div className="hero-overlay bg-opacity-80"></div>
                <div className="lg:ml-[600px]">
                    <div>
                        {/* login */}

                        <div className="my-20">
                            
                            <div className="px-10 py-4 border-4 rounded-md shadow-2xl">
                                <form onSubmit={handleSubmit(onSubmit)} className=" font-medium">
                                    <h3 className="text-accent text-center text-3xl font-bold my-5">Login Here</h3>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-base-200">Email</span>
                                        </label>
                                        <input type="email" {...register("email", { required: true })} placeholder="Enter Your Email" className="input input-bordered border-2 border-base-300" />
                                        {errors.email && <span className="text-red-600">Email is required</span>}
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-base-200">Password</span>
                                        </label>
                                        <input type="password" {...register("password", {
                                            required: true,
                                            minLength: 6,
                                            pattern: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/
                                        })} placeholder=" Enter Correct password" className="input input-bordered border-2 border-base-300" />
                                        {errors.password?.type === "required" &&
                                            <p className="text-red-600">Password is required</p>}
                                        {errors.password?.type === "minLength" &&
                                            <p className="text-red-600">Password minimum 6 characters</p>}
                                        {errors.password?.type === "pattern" &&
                                            <p className="text-red-600">Password must have one uppercase case and one number and spacial characters</p>}
                                        {
                                            passwordError && <p className="text-red-800 text-lg font-medium text-center">{passwordError}</p>
                                        }

                                    </div>
                                    <div className="form-control mt-6">
                                        <button type="submit" className="bg-[#2c6be0ec] hover:bg-[#245dc7] text-xl font-semibold hover:scale-110 duration-600 transition-all py-2 rounded-lg text-white">Login</button>
                                    </div>
                                </form>
                                <SocialLogin></SocialLogin>
                                <p className="text-center my-6 text-accent"><span className="opacity-80 mr-2">Are You New Hare?Please</span> <Link to={'/register'} className="hover:text-lime-400 text-lg font-semibold text-accent">Register</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Login;