import { auth, provider } from "../firebase/firebase.jsx";
import { signInWithPopup } from "firebase/auth"

const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error("ログインエラ：", error);
        throw error;
    }
}


const logOut = async () => {
    try {
        await auth.signOut()
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export { signInWithGoogle, logOut };
