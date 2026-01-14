import { useState } from "react";
import { type UserManagerInterface } from "../ManagerInterface/UserManagerInterface.js";
import type { User } from "firebase/auth";
import { DataParseError, NetworkError, APIError } from "../Helper/CustomErrors.js";
import { useRouteManager } from "../Router/useRouteManager.js";

export const useTeacherAPIKeyValidationFormViewModel = (userManager: UserManagerInterface, authData: User) => {
	const [teacherAPIKey, setTeacherAPIKey] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useRouteManager();

	const checkTeacherApiKey = async (apiKey: string) => {
		if (!apiKey.trim()) {
			alert("APIキーを入力してください。");
			return;
		}

		setLoading(true);
		const configTeacherAPIKEY = import.meta.env.VITE_TEACHER_APIKEY;

		if (apiKey === configTeacherAPIKEY) {
			console.log("教師用APIキーが正しいです。");
			navigate.toNameRegistration();
		} else {
			alert("教師用APIキーが間違っています。");
		}
		setLoading(false);
	};

	return {
		teacherAPIKey,
		setTeacherAPIKey,
		loading,
		checkTeacherApiKey: checkTeacherApiKey,
	};
};
