import { useState } from "react";
import { auth } from "../firebase/firebase.js";
import { type User } from "firebase/auth";
import { createClass, type Class } from "../Entity/Class.js";
import type { ClassManagerInterface } from "../ManagerInterface/ClassManagerInterface.js";
import { APIError, DataParseError, NetworkError } from "../Helper/CustomErrors.js";

export const useCreateClassViewModel = (classManager: ClassManagerInterface) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [authData, setAuthData] = useState<User | null>(auth.currentUser);
	const [className, setClassName] = useState<string>("");
	const [majorCode, setMajorCode] = useState<string>("");
	const [admissionYear, setAdmissionYear] = useState<string>("");
	const [errors, setErrors] = useState<{
		className?: string | undefined;
		admissionYear?: string | undefined;
		majorCode?: string | undefined;
	}>({});

	if (authData === null) {
		alert("ユーザーが認証されていません。再度ログインしてください。");
		return;
	}

	const checkClassName = (name: string) => {
		setErrors((prev) => ({
			...prev,
			className: name.trim() === "" ? "クラス名を入力してください。" : undefined,
		}));
	};

	const checkAdmissionYear = (year: string) => {
		const yearNum = Number(year);
		setErrors((prev) => ({
			...prev,
			admissionYear: isNaN(yearNum) || yearNum < 10 || yearNum > 99 ? "入学年度は10から100の間の数字で入力してください。" : undefined,
		}));
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const newErrors: {
			className?: string;
			admissionYear?: string;
			majorCode?: string;
		} = {};

		// Validation logic
		if (className.trim() === "") {
			newErrors.className = "クラス名を入力してください。";
		}

		const yearNum = Number(admissionYear);
		if (isNaN(yearNum) || yearNum < 10 || yearNum > 99) {
			newErrors.admissionYear = "入学年度は10から100の間の数字で入力してください。";
		}

		if (majorCode.trim() === "") {
			newErrors.majorCode = "専攻コードを入力してください。";
		}

		// Update errors state
		setErrors(newErrors);

		// If any errors exist, stop submission
		if (Object.keys(newErrors).length > 0) {
			return;
		}
		// Proceed if no errors
		const newClass = createClass(authData.uid, className, admissionYear, majorCode);

		try {
			await classManager.addNewClass(newClass as Class);
			alert("クラスが追加されました！🎉");
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
			// Reset form
			setClassName("");
			setAdmissionYear("");
			setMajorCode("");
			setErrors({});
		}
	};

	return { loading, className, setClassName, majorCode, setMajorCode, admissionYear, setAdmissionYear, errors, checkClassName, checkAdmissionYear, handleSubmit };
};
