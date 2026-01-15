import { useState } from "react";
import type { User } from "firebase/auth";
import { useNameRegistrationViewModel } from "../ViewModel/NameRegistrationViewModel.js";
import { UserManager } from "../Manager/UserManager.js";

type NameInputPageProps = {
	authData: User;
};

export const NameRegistrationView = ({ authData }: NameInputPageProps) => {
	const userManager = new UserManager();
	const { loading, name, setName, registerTeacherAndNavigateToDashboard } = useNameRegistrationViewModel(userManager, authData);

	const handleSubmit = () => {
		if (!name.trim()) {
			alert("名前を入力してください。");
			return;
		}
		registerTeacherAndNavigateToDashboard(name);
	};

	return (
		<div className="page-bg flex items-center justify-center px-6 py-12">
			<div className="w-full max-w-md card p-10">
				{/* Header */}
				<div className="text-center mb-8">
					<h2 className="heading-gradient mb-3">ようこそ！</h2>
					<p className="text-adaptive-secondary text-sm">アカウント登録を完了するために、お名前を入力してください</p>
				</div>

				{/* Name Input */}
				<div className="mb-6">
					<label htmlFor="name" className="block text-sm font-medium text-adaptive-secondary mb-2">
						お名前
					</label>
					<input
						id="name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="山田 太郎"
						disabled={loading}
						className="input disabled:opacity-50 disabled:cursor-not-allowed"
						onKeyDown={(e) => {
							if (e.key === "Enter" && !loading) {
								handleSubmit();
							}
						}}
					/>
				</div>

				{/* Submit Button */}
				<button
					onClick={handleSubmit}
					disabled={loading}
					className={`w-full inline-flex items-center justify-center text-white font-semibold py-3 rounded-lg text-lg transition-all duration-300 ${
						loading ? "btn-disabled" : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:-translate-y-0.5"
					}`}
				>
					{loading ? (
						<span className="flex items-center gap-2">
							<span className="spinner-sm" />
							登録中...
						</span>
					) : (
						"登録する"
					)}
				</button>

				{/* User Info Display */}
				<div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
					<p className="text-xs text-adaptive-secondary text-center">登録メールアドレス: {authData.email}</p>
				</div>
			</div>
		</div>
	);
};

export { NameRegistrationView as NameInputPage };
