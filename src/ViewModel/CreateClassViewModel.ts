import { useState } from "react";
import { type User } from "firebase/auth";
import { createClass, type Class } from "../Entity/Class.js";
import type { ClassManagerInterface } from "../ManagerInterface/ClassManagerInterface.js";
import { handleAppError } from "../Helper/handleAppError.js";

export const useCreateClassViewModel = (classManager: ClassManagerInterface, authData: User) => {
	const [loading, setLoading] = useState<boolean>(false);
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
		// Proceed if no errors
		const newClass = createClass(authData.uid, className, admissionYear, majorCode, isOptionalClass ? classCode : null);

		try {
			setLoading(true);
			await classManager.addClass(newClass as Class);
			alert("クラスが追加されました！");
		} catch (error) {
			alert(handleAppError(error));
		} finally {
			setLoading(false);
			setClassName("");
			setAdmissionYear("");
			setMajorCode("");
			setErrors({});
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
