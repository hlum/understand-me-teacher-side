import { type AuthManagerInterface } from "../ManagerInterface/AuthManagerInterface.js";
import { useState } from "react";
import type { UserManagerInterface } from "../ManagerInterface/UserManagerInterface.js";
import { handleAppError } from "../Helper/handleAppError.js";

export const useSignInViewModel = (authManager: AuthManagerInterface, userManager: UserManagerInterface) => {
	const [loading, setLoading] = useState(false);

	const handleSignIn = async () => {
		try {
			setLoading(true);
			const _ = await authManager.signInWithGoogle();
		} catch (error) {
			alert(handleAppError(error));
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
			// このエラーはサイレントに処理（falseを返す）
			console.error("⛔ Internal Error:", error);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return { loading, handleSignIn };
};
