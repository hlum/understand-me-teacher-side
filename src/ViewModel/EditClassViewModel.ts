import { useState, useEffect } from "react";
import { type User } from "firebase/auth";
import { type Class } from "../Entity/Class.js";
import type { ClassManagerInterface } from "../ManagerInterface/ClassManagerInterface.js";
import { handleAppError } from "../Helper/handleAppError.js";

type FormErrors = {
	className?: string | undefined;
	admissionYear?: string | undefined;
	majorCode?: string | undefined;
	classCode?: string | undefined;
};

export const useEditClassViewModel = (classManager: ClassManagerInterface, authData: User, classID: string) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [className, setClassName] = useState<string>("");
	const [majorCode, setMajorCode] = useState<string>("");
	const [admissionYear, setAdmissionYear] = useState<string>("");

	const [isOptionalClass, setIsOptionalClass] = useState<boolean>(false);
	const [classCode, setClassCode] = useState<string>("");

	const [errors, setErrors] = useState<FormErrors>({});

	const [originalClass, setOriginalClass] = useState<Class | null>(null);

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
				alert(handleAppError(error));
			} finally {
				setLoading(false);
			}
		};

		fetchClassData();
	}, [classID]);

	const checkClassName = (name: string) => {
		setErrors((prev): FormErrors => ({
			...prev,
			className: name.trim() === "" ? "クラス名を入力してください。" : undefined,
		}));
	};

	const checkAdmissionYear = (year: string) => {
		const yearNum = Number(year);
		setErrors((prev): FormErrors => ({
			...prev,
			admissionYear: isNaN(yearNum) || yearNum < 10 || yearNum > 99 ? "入学年度は10から100の間の数字で入力してください。" : undefined,
		}));
	};

	const checkClassCode = (code: string) => {
		if (!isOptionalClass) {
			return;
		}

		setErrors((prev): FormErrors => ({
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

		setErrors(newErrors);

		if (Object.keys(newErrors).length > 0) {
			return;
		}

		if (!originalClass) {
			alert("クラス情報が読み込まれていません。");
			return;
		}

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
			alert("クラスが更新されました！");
		} catch (error) {
			alert(handleAppError(error));
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
