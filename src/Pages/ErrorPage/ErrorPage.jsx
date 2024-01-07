import { Link } from "react-router-dom";


const ErrorPage = () => {
    return (
        <div className="max-w-screen-2xl mx-auto h-screen">
            <div className="flex justify-center items-center">
                <div className="shadow-2xl w-1/2 mx-auto mt-5 h-[600px] space-y-5 text-center rounded-lg">
                    <div className="flex justify-center items-center">
                        <img className="w-full rounded-t-lg" src="https://i.ibb.co/D7Zt3Kb/404-error-page-svg-animation.gif" alt="" />
                    </div>
                    <h3 className="text-6xl font-semibold">40<span className="text-red-600">4</span> Error</h3>
                    <h1 className="text-2xl font-medium">This page does not exist.</h1>
                    <div className="pt-10">
                        <Link to={'/'}>
                            <button className="btn btn-neutral">Go Home</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;