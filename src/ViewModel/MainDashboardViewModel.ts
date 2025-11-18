import { useState, useEffect } from "react";
import type { ClassManagerInterface } from "../ManagerInterface/ClassManagerInterface.js";
import { DataParseError, NetworkError, APIError } from "../Helper/CustomErrors.js";
import type { Class } from "../Entity/Class.js";
import type { User } from "firebase/auth";
import type { UserEntity } from "@/Entity/UserEntity.js";
import type { UserManagerInterface } from "@/ManagerInterface/UserManagerInterface.js";

export const useMainDashboardViewModel = (userManager: UserManagerInterface, classManager: ClassManagerInterface, authData: User) => {
	const [classes, setClasses] = useState<Class[]>([]);
	const [user, setUser] = useState<UserEntity | null>(null);
	const [loading, setLoading] = useState(true);

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

	// Userのデータを取得
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				setLoading(true);
				const userData = await userManager.fetchUserData(authData.uid);
				setUser(userData);
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
		fetchUserData();
	}, [authData]);

	return { classes, loading, authData, user };
};
