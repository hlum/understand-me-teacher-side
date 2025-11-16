import { useState } from "react";
import type { UserManagerInterface } from "../ManagerInterface/UserManagerInterface.js";
import { useRouteManager } from "../Router/useRouteManager.js";
import type { User } from "firebase/auth";
import { DataParseError, NetworkError, APIError } from "../Helper/CustomErrors.js";

export const useNameRegistrationViewModel = (userManager: UserManagerInterface, authData: User) => {
	const navigate = useRouteManager();
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);

	const registerTeacherAndNavigateToDashboard = async (name: string) => {
		try {
			setLoading(true);
			await userManager.registerTeacher(authData.uid, authData.email ?? "", name, authData.photoURL ?? "");
			alert("教師として登録されました ✅");
			navigate.toMainDashboard();
		} catch (error) {
			if (error instanceof APIError) {
				alert("API側でエラーが発生しました。もう一度お試しください。");
				console.error("APIError: ", error);
			} else if (error instanceof NetworkError) {
				alert("ネットワークエラーが発生しました。接続を確認して、もう一度お試しください。");
				console.error("NetworkError: ", error);
			} else if (error instanceof DataParseError) {
				alert("データのデコード中にエラーが発生しました。");
				console.error("DataParseError: ", error);
			} else {
				alert("クラスの詳細を取得中にエラーが発生しました。");
				console.error("Error: ", error);
			}
		} finally {
			setLoading(false);
		}
	};

	return { name, setName, loading, registerTeacherAndNavigateToDashboard };
};
