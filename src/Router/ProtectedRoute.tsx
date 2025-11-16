import { useEffect, useState, type JSX } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase/firebase.js";
import { useRouteManager } from "./useRouteManager.js";

// Userが認証されている場合のみchildrenを表示するRouteコンポーネント
export const ProtectedRoute = ({ children }: { children: (user: User) => JSX.Element }) => {
	const [authData, setAuthData] = useState<User | null>(auth.currentUser);
	const routeManager = useRouteManager();

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (user) => {
			setAuthData(user);
		});
		return unsub;
	}, []);

	useEffect(() => {
		if (authData === null) {
			routeManager.toLogin();
		}
	}, [authData]);

	if (!authData) return null;

	return children(authData);
};
