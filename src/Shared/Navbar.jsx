import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";
import toast from "react-hot-toast";
import svg from '../assets/icons8-notification.gif'
import usePost from "../Hook/usePost";
import SearchInput from "../components/SearchInput";
import useMessage from "../Hook/useMessage";
import { AiFillMessage } from "react-icons/ai";
import useAdmin from "../Hook/useAdmin";
import useReportPost from "../Hook/useReportPost";

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);
    const [userPost] = usePost();
    const [allMessage] = useMessage();
    const [isAdmin] = useAdmin();
    const [userReportPost] = useReportPost();
    console.log(userReportPost);
    const navList = <>
        <NavLink
            to="/"
            className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "border-b-2 hover:scale-110 transition-all text-lg font-semibold cursor-pointer border-b-[#5490fd] text-[#6096fc]" : " hover:scale-110 transition-all text-gray-600 font-bold"
            }
        >
            Home
        </NavLink>
        <NavLink
            to="/message"
            className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "border-b-2 hover:scale-110 transition-all text-lg font-semibold cursor-pointer border-b-[#5490fd] text-[#6096fc]" : " hover:scale-110 transition-all text-gray-600 font-bold"
            }
        >
            <p className="flex items-center gap-1">Message
                {allMessage?.length ? <AiFillMessage className="text-xl text-blue-600"></AiFillMessage> : ''}{allMessage?.length && user ? allMessage.length + '+' : ''}</p>
        </NavLink>
        {
            isAdmin && user ? <NavLink
                to="/adminNotification"
                className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "border-b-2 hover:scale-110 transition-all text-lg font-semibold cursor-pointer border-b-[#5490fd] text-[#6096fc]" : " hover:scale-110 transition-all text-gray-600 font-bold"
                }
            >
                <p className="flex items-center">Notification
                    {userReportPost?.length ? <img className="w-7" src={svg} alt="" /> : ''}{userReportPost?.length && user ? userReportPost.length + '+' : ''}</p>
            </NavLink>
                :
                <NavLink
                    to="/notification"
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "border-b-2 hover:scale-110 transition-all text-lg font-semibold cursor-pointer border-b-[#5490fd] text-[#6096fc]" : " hover:scale-110 transition-all text-gray-600 font-bold"
                    }
                >
                    <p className="flex items-center">Notification
                        {userPost?.length ? <img className="w-7" src={svg} alt="" /> : ''}{userPost?.length && user ? userPost.length + '+' : ''}</p>
                </NavLink>
        }
    </>

    const handleLogout = () => {
        logOut()
            .then(() => {
                toast.success('Logged Out Successfully')
            })
            .catch(err => {
                console.log(err);
            })
    }
    return (
        <div className="z-10 fixed bg-slate-100 w-full lg:max-w-screen-xl mx-auto px-3">
            <div className="lg:grid lg:grid-cols-5 items-center mt-2 pt-1 px-5 lg:px-0 mb-2">
                <div className="lg:col-span-2 order-2 lg:order-none mt-14 lg:mt-0 md:ml-56 ml-10 lg:ml-0">
                    <ul className="flex gap-10">
                        {navList}
                    </ul>
                </div>
                <div className="order-1 lg:order-none flex justify-center -mt-20 lg:-mt-0">
                    <img className="w-20" src="https://i.ibb.co/FV55Bfp/Screenshot-2024-01-03-105818-removebg-preview.png" alt="" />
                </div>
                <div className="grid grid-cols-5 col-span-2 mr-16 gap-3 lg:gap-14 order-3 lg:order-none mt-16 lg:mt-0 md:ml-28 md:-mr-24 lg:-mr-0 lg:ml-0 px-5 lg:px-0">
                    <div className="form-control col-span-4 md:pl-48 lg:pl-0 ">
                        <SearchInput></SearchInput>
                    </div>
                    <div className="dropdown dropdown-end col-span-1">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-12 rounded-full">
                                {
                                    user ? <img alt="User-Photo" src={user?.photoURL} />
                                        :
                                        <img alt="User-Photo" src="https://i.ibb.co/ZWKSncC/default-avatar-removebg-preview.png" />
                                }
                            </div>
                        </div>
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            {user && !isAdmin ? <li>
                                <Link to={'/profile'}>
                                    Profile <span className="badge">New</span>
                                </Link>
                            </li>
                                :
                                ''
                            }
                            { isAdmin ? <li>
                                <Link to={'/adminProfile'}>
                                    Profile
                                </Link>
                            </li>
                                :
                                ''
                            }
                            {/* <li><a>Settings</a></li> */}
                            {
                                user ? <li onClick={handleLogout}><a>Logout</a></li>
                                    :
                                    <li><Link to={'/login'}>Login</Link></li>
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;