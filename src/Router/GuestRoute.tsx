import { useEffect, useMemo, useState, type JSX } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase/firebase.js";
import { useRouteManager } from "./useRouteManager.js";
import { UserManager } from "../Manager/UserManager.js";
import { APIError, NetworkError, DataParseError } from "../Helper/CustomErrors.js";

export const GuestRoute = ({ children }: { children(authenticating: boolean): JSX.Element }) => {
	// authData: undefined = 認証状態を取得中, null = 未認証, User = 認証済み
	const [authData, setAuthData] = useState<User | null | undefined>(undefined);
	const [checking, setChecking] = useState(false);
	const userManager = new UserManager();
	const routeManager = useRouteManager();

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (user) => {
			setAuthData(user);
		});
		return unsub;
	}, []);

	useEffect(() => {
		const checkUserAuthenticationStatus = async () => {
			if (authData === null) {
				return;
			}

			if (authData === undefined) {
				return;
			}

			try {
				setChecking(true);

				const teacherExists = await userManager.teacherRecordExists(authData.uid);
				if (!teacherExists) {
					routeManager.toApiKeyValidation();
					return;
				}

				routeManager.toMainDashboard();
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
				setChecking(false);
			}
		};

		checkUserAuthenticationStatus();
	}, [authData]);

	return children(checking || authData === undefined);
};
