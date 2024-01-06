import { useContext } from "react";
import { Navigate, useLocation} from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProvider";
// eslint-disable-next-line react/prop-types
const PrivateRouter = ({children}) => {
    const {user, loading} = useContext(AuthContext);
    const location = useLocation();
    if(loading){
        return <div className="max-w-screen-xl mx-auto flex justify-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>
    }
    if(user){
        return children;
    }
    return <Navigate state={location.pathname} to={'/login'}></Navigate>
};

export default PrivateRouter;