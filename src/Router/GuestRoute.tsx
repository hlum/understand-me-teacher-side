import { useEffect, useState, type JSX } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase/firebase.js";
import { useRouteManager } from "./useRouteManager.js";
import { UserManager } from "../Manager/UserManager.js";

export const GuestRoute = ({ children }: { children: JSX.Element }) => {
	const [authData, setAuthData] = useState<User | null>(auth.currentUser);
	const [teacherRecordExists, setTeacherRecordExists] = useState<boolean>(false);
	const userManager = new UserManager();
	const routeManager = useRouteManager();

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (user) => {
			setAuthData(user);
		});
		return unsub;
	}, []);

	useEffect(() => {
		if (!authData) return;

		checkTeacherRecord(authData.uid);

		if (authData && teacherRecordExists) {
			routeManager.toMainDashboard();
		}

		if (authData && !teacherRecordExists) {
			routeManager.toApiKeyValidation();
		}
	}, [authData, teacherRecordExists]);

	const checkTeacherRecord = async (uid: string) => {
		try {
			const exists = await userManager.teacherRecordExists(uid);
			setTeacherRecordExists(exists);
		} catch (error) {}
	};

	return children;
};
