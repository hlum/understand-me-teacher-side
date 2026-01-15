import { useState } from "react";
import { useRouteManager } from "../Router/useRouteManager.js";

export const useTeacherAPIKeyValidationFormViewModel = () => {
	const [teacherAPIKey, setTeacherAPIKey] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useRouteManager();

	const validateTeacherApiKey = async (apiKey: string) => {
		if (!apiKey.trim()) {
			alert("APIキーを入力してください。");
			return;
		}

		setLoading(true);
		const configTeacherAPIKEY = import.meta.env.VITE_TEACHER_APIKEY;

		if (apiKey === configTeacherAPIKEY) {
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
		validateTeacherApiKey,
	};
};
