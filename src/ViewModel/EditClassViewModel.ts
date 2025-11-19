import { useState, useEffect } from "react";
import { type User } from "firebase/auth";
import { type Class } from "../Entity/Class.js";
import type { ClassManagerInterface } from "../ManagerInterface/ClassManagerInterface.js";
import { APIError, DataParseError, NetworkError } from "../Helper/CustomErrors.js";

export const useEditClassViewModel = (classManager: ClassManagerInterface, authData: User, classID: string) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [className, setClassName] = useState<string>("");
	const [majorCode, setMajorCode] = useState<string>("");
	const [admissionYear, setAdmissionYear] = useState<string>("");

	const [isOptionalClass, setIsOptionalClass] = useState<boolean>(false);
	const [classCode, setClassCode] = useState<string>(""); // 選択科目のときに使うコード

	const [errors, setErrors] = useState<{
		className?: string | undefined;
		admissionYear?: string | undefined;
		majorCode?: string | undefined;
		classCode?: string | undefined;
	}>({});

	const [originalClass, setOriginalClass] = useState<Class | null>(null);

	// クラス情報を取得
	useEffect(() => {
		const fetchClassData = async () => {
			try {
				setLoading(true);
				const classData = await classManager.fetchClass(classID);
				setOriginalClass(classData);
				setClassName(classData.name);
				setAdmissionYear(classData.admissionYear.toString());
				setMajorCode(classData.majorCode);
				setIsOptionalClass(classData.classCode !== null);
				setClassCode(classData.classCode ?? "");
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
				setLoading(false);
			}
		};

		fetchClassData();
	}, [classID]);

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

	const checkClassCode = (code: string) => {
		if (!isOptionalClass) {
			return;
		}

		setErrors((prev) => ({
			...prev,
			classCode: code.trim() === "" ? "専攻コードを入力してください。" : undefined,
		}));
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const newErrors: {
			className?: string;
			admissionYear?: string;
			majorCode?: string;
			classCode?: string;
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

		if (isOptionalClass && classCode.trim() === "") {
			newErrors.classCode = "選択科目の場合はクラスコードを入力してください。";
		}

		// Update errors state
		setErrors(newErrors);

		// If any errors exist, stop submission
		if (Object.keys(newErrors).length > 0) {
			return;
		}

		if (!originalClass) {
			alert("クラス情報が読み込まれていません。");
			return;
		}

		// Proceed if no errors
		const updatedClass: Class = {
			id: classID,
			teacherID: authData.uid,
			name: className,
			admissionYear: Number(admissionYear),
			majorCode: majorCode,
			classCode: isOptionalClass ? classCode : null,
		};

		try {
			setLoading(true);
			await classManager.updateClass(updatedClass);
			alert("クラスが更新されました！🎉");
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
				alert("クラスの更新中にエラーが発生しました。");
				console.error("Error: ", error);
			}
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		className,
		setClassName,
		majorCode,
		setMajorCode,
		admissionYear,
		setAdmissionYear,
		errors,
		checkClassName,
		checkAdmissionYear,
		handleSubmit,
		isOptionalClass,
		setIsOptionalClass,
		classCode,
		setClassCode,
		checkClassCode,
	};
};
