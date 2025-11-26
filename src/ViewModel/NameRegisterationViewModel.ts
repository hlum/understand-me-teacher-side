import { useState } from "react";
import type { UserManagerInterface } from "../ManagerInterface/UserManagerInterface.js";
import { useRouteManager } from "../Router/useRouteManager.js";
import type { User } from "firebase/auth";
import { handleAppError } from "../Helper/handleAppError.js";

export const useNameRegistrationViewModel = (userManager: UserManagerInterface, authData: User) => {
	const navigate = useRouteManager();
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);

	const registerTeacherAndNavigateToDashboard = async (name: string) => {
		try {
			setLoading(true);

			const googleProvider = authData.providerData.find((provider) => provider.providerId === "google.com");

			await userManager.registerTeacher(authData.uid, authData.email ?? "", name, googleProvider?.photoURL ?? "");
			alert("教師として登録されました ✅");
			navigate.toMainDashboard();
		} catch (error) {
			alert(handleAppError(error));
		} finally {
			setLoading(false);
		}
	};

	return { name, setName, loading, registerTeacherAndNavigateToDashboard };
};
