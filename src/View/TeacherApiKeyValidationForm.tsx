import type { User } from "firebase/auth";
import { useTeacherAPIKeyValidationFormViewModel } from "../ViewModel/TeacherAPIKeyValidationFormViewModel.js";
import { UserManager } from "../Manager/UserManager.js";

type ApiKeyInputProps = {
	authData: User;
};

const TeacherApiKeyValidationForm: React.FC<ApiKeyInputProps> = ({ authData }) => {
	const userManager = new UserManager();
	const { teacherAPIKey, setTeacherAPIKey, loading, checkTeacherApiKey } = useTeacherAPIKeyValidationFormViewModel(userManager, authData);

	return (
		<div className="page-bg-auth flex items-center justify-center px-6 py-12">
			<div className="w-full max-w-md card-auth p-10">
				{/* Header */}
				<div className="text-center mb-8">
					<h2 className="heading-gradient mb-3">教師用APIキー認証</h2>
					<p className="text-adaptive-secondary text-sm">教師専用のAPIキーを入力してアカウントを登録してください</p>
				</div>

				{/* API Key Input */}
				<div className="mb-6">
					<label htmlFor="apiKey" className="block text-sm font-medium text-adaptive-secondary mb-2">
						APIキー
					</label>
					<input
						id="apiKey"
						type="password"
						value={teacherAPIKey}
						onChange={(e) => setTeacherAPIKey(e.target.value)}
						placeholder="教師用APIキーを入力してください"
						disabled={loading}
						className="input disabled:opacity-50 disabled:cursor-not-allowed"
						onKeyDown={(e) => {
							if (e.key === "Enter" && !loading) {
								checkTeacherApiKey(teacherAPIKey);
							}
						}}
					/>
				</div>

				{/* Submit Button */}
				<button
					onClick={() => checkTeacherApiKey(teacherAPIKey)}
					disabled={loading}
					className={`w-full inline-flex items-center justify-center text-white font-semibold py-3 rounded-lg text-lg transition-all duration-300 ${
						loading ? "btn-disabled" : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:-translate-y-0.5"
					}`}
				>
					{loading ? (
						<span className="flex items-center gap-2">
							<span className="spinner-sm" />
							検証中...
						</span>
					) : (
						"検証する"
					)}
				</button>

				{/* User Info Display */}
				<div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
					<p className="text-xs text-adaptive-secondary text-center">ログイン中: {authData.email}</p>
				</div>
			</div>
		</div>
	);
};

export { TeacherApiKeyValidationForm as ApiKeyCheckBeforeRegistration };
