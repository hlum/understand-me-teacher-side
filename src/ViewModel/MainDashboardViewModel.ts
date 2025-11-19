import { useState, useEffect } from "react";
import type { ClassManagerInterface } from "../ManagerInterface/ClassManagerInterface.js";
import { handleAppError } from "../Helper/handleAppError.js";
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
				alert(handleAppError(error));
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
				alert(handleAppError(error));
			} finally {
				setLoading(false);
			}
		};
		fetchUserData();
	}, [authData]);

	return { classes, loading, authData, user };
};
