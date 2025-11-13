import { type AuthManagerInterface } from "../ManagerInterface/AuthManagerInterface.js";
import { useState } from "react";

export const useSignInViewModel = (authManager: AuthManagerInterface) => {
	const [loading, setLoading] = useState(false);
	const handleSignIn = async () => {
		try {
			setLoading(true);
			const user = await authManager.signInWithGoogle();
		} catch (error) {
			alert("サインインに失敗しました。もう一度お試しください。");
			console.error("SignIn Error: ", error);
		} finally {
			setLoading(false);
		}
	};

	return { loading, handleSignIn };
};
