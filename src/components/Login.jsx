import React from 'react'
import { signInWithPopup } from "firebase/auth";
import {auth, provider} from "../firebase/firebase.jsx";

const Login = () => {
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("User Info: " ,user);
        } catch (error) {
            console.log("Google Sign-In Error: ", error);
        }
    }

    return (
        <div>
            <h2> Login With Google </h2>
            <button onClick={signInWithGoogle}>Sign In With Google</button>
        </div>
    );
};
export default Login
