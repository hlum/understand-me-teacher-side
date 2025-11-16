import { type AuthManagerInterface } from "../ManagerInterface/AuthManagerInterface.js";
import { useState } from "react";
import type { UserManagerInterface } from "../ManagerInterface/UserManagerInterface.js";

export const useSignInViewModel = (authManager: AuthManagerInterface, userManager: UserManagerInterface) => {
	const [loading, setLoading] = useState(false);

	const handleSignIn = async () => {
		try {
			setLoading(true);
			const _ = await authManager.signInWithGoogle();
		} catch (error) {
			alert("サインインに失敗しました。もう一度お試しください。");
			console.error("SignIn Error: ", error);
		} finally {
			setLoading(false);
		}
	};

	const checkUserExistsAsTeacher = async (uid: string) => {
		setLoading(true);
		try {
			const exists = await userManager.teacherRecordExists(uid);
			return exists;
		} catch (error) {
			console.error("Check User Exists Error: ", error);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return { loading, handleSignIn };
};
