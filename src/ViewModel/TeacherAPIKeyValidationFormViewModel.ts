import { useState } from "react";
import { type UserManagerInterface } from "../ManagerInterface/UserManagerInterface.js";
import type { User } from "firebase/auth";
import { DataParseError, NetworkError, APIError } from "../Helper/CustomErrors.js";

export const useTeacherAPIKeyValidationFormViewModel = (userManager: UserManagerInterface, onRegisterationComplete: () => void, authData: User) => {
	const [teacherAPIKey, setTeacherAPIKey] = useState("");
	const [userIsValidTeacher, setUserIsValidTeacher] = useState(false);
	const [loading, setLoading] = useState(false);

	const checkTeacherApiKey = async (apiKey: string) => {
		if (!apiKey.trim()) {
			alert("APIキーを入力してください。");
			return;
		}

		setLoading(true);
		const configTeacherAPIKEY = import.meta.env.VITE_TEACHER_APIKEY;

		if (apiKey === configTeacherAPIKEY) {
			console.log("教師用APIキーが正しいです。");
			setUserIsValidTeacher(true);
		} else {
			alert("教師用APIキーが間違っています。");
		}
		setLoading(false);
	};

	const registerTeacher = async (name: string) => {
		try {
			await userManager.registerTeacher(authData.uid, authData.email ?? "", name, authData.photoURL ?? "");
			onRegisterationComplete();
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
	};

	return {
		teacherAPIKey,
		setTeacherAPIKey,
		userIsValidTeacher,
		loading,
		checkTeacherApiKey,
		registerTeacher,
	};
};
