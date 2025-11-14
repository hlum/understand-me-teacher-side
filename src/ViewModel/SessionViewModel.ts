import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase/firebase.js";
import type { UserManagerInterface } from "../ManagerInterface/UserManagerInterface.js";
import type { AuthManagerInterface } from "../ManagerInterface/AuthManagerInterface.js";
import { APIError, DataParseError, NetworkError } from "../Helper/CustomErrors.js";

export const useSessionViewModel = (userManager: UserManagerInterface, authManager: AuthManagerInterface) => {
	const [authData, setAuthData] = useState<User | null>(null);
	const [userDataSaved, setUserDataSaved] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			setLoading(true);
			setAuthData(currentUser);

			if (currentUser?.uid) {
				try {
					const exists = await userManager.userAlreadyExistsInDB(currentUser.uid);
					setUserDataSaved(exists);
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
				}
			}

			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const logOut = () => authManager.logOut();

	const reloadAfterRegistration = async () => {
		if (authData?.uid) {
			const exists = await userManager.userAlreadyExistsInDB(authData.uid);
			setUserDataSaved(exists);
		}
	};

	return { authData, userDataSaved, loading, logOut, reloadAfterRegistration };
};
