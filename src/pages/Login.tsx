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
            <h2> Login With Google </h2>
            <button onClick={handleLogin}>Sign In With Google</button>
        </div>
    );
};
export default Login
