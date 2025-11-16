import { useEffect, useMemo, useState, type JSX } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase/firebase.js";
import { useRouteManager } from "./useRouteManager.js";
import { UserManager } from "../Manager/UserManager.js";
import { APIError, NetworkError, DataParseError } from "../Helper/CustomErrors.js";

// 認証済みユーザーのみchildrenを表示するRouteコンポーネント。
// さらに、Teacherレコードの有無を確認し、未登録ならAPIキー検証ページへ誘導する。
export const ProtectedRoute = ({ children }: { children: (user: User, authenticating: boolean) => JSX.Element }) => {
	const [authData, setAuthData] = useState<User | null | undefined>(undefined);
	const [checking, setChecking] = useState(true);

	const routeManager = useRouteManager();
	const userManager = useMemo(() => new UserManager(), []);

	useEffect(() => {
		return onAuthStateChanged(auth, (user) => setAuthData(user));
	}, []);

	useEffect(() => {
		const check = async () => {
			if (authData === undefined) return;
			if (authData === null) {
				routeManager.toLogin();
				return;
			}
			setChecking(true);

			const exists = await userManager.teacherRecordExists(authData.uid);
			if (!exists) {
				routeManager.toApiKeyValidation();
			}
			setChecking(false);
		};
		check();
	}, [authData]);

	if (authData === undefined) return children(null as any, true);
	if (authData === null) return null;

	return children(authData, checking);
};
