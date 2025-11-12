import React from "react";
import { type User } from "firebase/auth";
import { useState } from "react";
import { type Class } from "../Entity/Class.js";
import { addNewClass } from "../Manager/ClassManager.js";

interface AddNewClassViewProps {
	user: User;
}

const CreateClassView = (props: AddNewClassViewProps) => {
	const { user } = props;
	const [className, setClassName] = useState("");
	const [admissionYear, setAdmissionYear] = useState("");
	const [majorCode, setMajorCode] = useState("");
	const [errors, setErrors] = useState<{
		className?: string | undefined;
		admissionYear?: string | undefined;
		majorCode?: string | undefined;
	}>({});

	const checkClassName = (name: string) => {
		setErrors((prev) => ({
			...prev,
			className:
				name.trim() === "" ? "クラス名を入力してください。" : undefined,
		}));
	};

	const checkAdmissionYear = (year: string) => {
		const yearNum = Number(year);
		setErrors((prev) => ({
			...prev,
			admissionYear:
				isNaN(yearNum) || yearNum < 10 || yearNum > 99
					? "入学年度は10から100の間の数字で入力してください。"
					: undefined,
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
			newErrors.admissionYear =
				"入学年度は10から100の間の数字で入力してください。";
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
		const newClass = {
			teacherID: user.uid,
			name: className,
			admissionYear: Number(admissionYear),
			majorCode: majorCode,
		};

		try {
			await addNewClass(newClass as Class);
			alert("クラスが追加されました！🎉");
		} catch (error) {
			alert(`クラスの追加に失敗しました。${error}`);
		} finally {
			// Reset form
			setClassName("");
			setAdmissionYear("");
			setMajorCode("");
			setErrors({});
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center px-6 py-12">
			<div className="w-full max-w-2xl bg-gray-900/70 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.6)] hover:shadow-[0_0_40px_rgba(0,0,0,0.8)] transition-all duration-500 p-10">
				{/* Header */}
				<h1 className="text-4xl font-bold text-center text-white mb-10 tracking-wide">
					クラスを追加
				</h1>

				{/* クラス名 */}
				<div className="mb-8">
					<label className="block text-gray-300 font-medium mb-2">
						クラス名
					</label>
					<input
						type="text"
						placeholder="例: iOS開発クラス"
						value={className}
						onChange={(event) => {
							setClassName(event.target.value);
							checkClassName(event.target.value);
						}}
						className={`w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white border ${
							errors.className
								? "border-red-500"
								: "border-gray-700"
						} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
					/>
					{errors.className && (
						<p className="text-red-500 text-sm mt-2">
							{errors.className}
						</p>
					)}
				</div>

				{/* 入学年度 */}
				<div className="mb-8">
					<label className="block text-gray-300 font-medium mb-2">
						対象の入学年度{" "}
					</label>
					<input
						type="number"
						placeholder="例: 23"
						value={admissionYear}
						onChange={(event) => {
							setAdmissionYear(event.target.value);
							checkAdmissionYear(event.target.value);
						}}
						className={`w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white border ${
							errors.admissionYear
								? "border-red-500"
								: "border-gray-700"
						} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
					/>
					{errors.admissionYear && (
						<p className="text-red-500 text-sm mt-2">
							{errors.admissionYear}
						</p>
					)}
				</div>

				{/* 専攻コード */}
				<div className="mb-10">
					<label className="block text-gray-300 font-medium mb-2">
						専攻コード
					</label>
					<input
						type="text"
						placeholder="例: cm, ap, ac"
						value={majorCode}
						onChange={(event) => setMajorCode(event.target.value)}
						className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
					/>
					{errors.majorCode && (
						<p className="text-red-500 text-sm mt-2">
							{errors.majorCode}
						</p>
					)}
				</div>

				{/* ボタン */}
				<button
					onClick={handleSubmit}
					disabled={
						errors.className === null ||
						errors.admissionYear === null
					}
					className={`w-full py-3 rounded-lg font-semibold text-lg tracking-wide transition-all duration-300 ${
						errors.className || errors.admissionYear
							? "bg-gray-700 text-gray-400 cursor-not-allowed"
							: "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] hover:-translate-y-0.5"
					}`}
				>
					クラスを追加する
				</button>
			</div>
		</div>
	);
};

export default CreateClassView;
