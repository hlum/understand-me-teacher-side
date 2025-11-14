import { useState, useEffect } from "react";
import type { ClassManagerInterface } from "../ManagerInterface/ClassManagerInterface.js";
import { DataParseError, NetworkError, APIError } from "../Helper/CustomErrors.js";
import type { Class } from "../Entity/Class.js";
import { auth } from "../firebase/firebase.js";

export const useMainDashboardViewModel = (classManager: ClassManagerInterface) => {
	const [authData, setAuthData] = useState(auth.currentUser);
	const [classes, setClasses] = useState<Class[]>([]);
	const [loading, setLoading] = useState(true);

	if (!authData) {
		return;
	}

	useEffect(() => {
		const fetchClasses = async () => {
			try {
				setLoading(true);
				const classList = await classManager.fetchClassesForTeacher(authData.uid);
				setClasses(classList);
			} catch (error: unknown) {
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
		fetchClasses();
	}, [authData]);

	return { classes, loading, authData };
};
