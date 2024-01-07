import { createBrowserRouter } from "react-router-dom";
import Root from "../Root/Root";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import Home from "../Pages/Home/Home";
import Message from "../Pages/Message/Message";
import Notification from "../Pages/Notification/Notification";
import Profile from "../Pages/Profile/Profile";
import SavedPostDetails from "../components/SavedPostDetails";
import SearchProfileDetails from "../components/SearchProfileDetails";
import AdminNotification from "../Pages/AdminNotification";
import PrivateRouter from "./PrivateRouter/PrivateRouter";
import AdminProfile from "../Pages/AdminProfile/AdminProfile";

const MainRouter = createBrowserRouter([
    {
        path: '/',
        element: <Root></Root>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                path: '/',
                element: <Home></Home>
            }
            ,
            {
                path: '/login',
                element: <Login></Login>
            },
            {
                path: '/register',
                element: <Register></Register>
            },
            {
                path: '/message',
                element: <Message></Message>
            },
            {
                path: '/notification',
                element: <Notification></Notification>
            },
            {
                path: '/adminNotification',
                element: <PrivateRouter><AdminNotification></AdminNotification></PrivateRouter>
            },
            {
                path: '/profile',
                element: <Profile></Profile>
            },
            {
                path: '/adminProfile',
                element: <AdminProfile></AdminProfile>
            },
            {
                path: '/savedPostDetails/:id',
                element: <SavedPostDetails></SavedPostDetails>
            },
            {
                path: '/details/:id',
                element: <SearchProfileDetails></SearchProfileDetails>
            }
        ]
    }
])

export default MainRouter;