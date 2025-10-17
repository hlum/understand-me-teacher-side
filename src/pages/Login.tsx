import { signInWithGoogle } from "../api/auth.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();


    const handleLogin = async () => {
        try {
            const user = await signInWithGoogle();
            navigate("/");
        } catch {
            alert("Login 失敗しました。")
        }
    }
    
    return (
        <div>
            <h2 className="h-2 text-blue-500"> Login With Google </h2>
            <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    onClick={handleLogin}>Sign In With Google</button>
        </div>
    );
};
export default Login
