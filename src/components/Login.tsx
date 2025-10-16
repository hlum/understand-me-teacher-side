import React, {useEffect} from 'react'
import { signInWithGoogle } from "../api/auth.js";

const Login = () => {


    const handleLogin = async () => {
        try {
            const user = await signInWithGoogle();
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
