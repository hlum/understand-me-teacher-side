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
		<div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center px-6 py-12">
			<div className="w-full max-w-md bg-gray-900/70 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.6)] hover:shadow-[0_0_40px_rgba(0,0,0,0.8)] transition-all duration-500 p-10">
				{/* Header */}
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-3 tracking-wide">教師用APIキー認証</h2>
					<p className="text-gray-300 text-sm">教師専用のAPIキーを入力してアカウントを登録してください</p>
				</div>

				{/* API Key Input */}
				<div className="mb-6">
					<label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
						APIキー
					</label>
					<input
						id="apiKey"
						type="password"
						value={teacherAPIKey}
						onChange={(e) => setTeacherAPIKey(e.target.value)}
						placeholder="教師用APIキーを入力してください"
						disabled={loading}
						className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
						loading ? "bg-gray-700 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:-translate-y-0.5"
					}`}
				>
					{loading ? (
						<span className="flex items-center gap-2">
							<span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
							検証中...
						</span>
					) : (
						"検証する"
					)}
				</button>

				{/* User Info Display */}
				<div className="mt-6 pt-6 border-t border-gray-700">
					<p className="text-xs text-gray-400 text-center">ログイン中: {authData.email}</p>
				</div>
			</div>
		</div>
	);
};

export { TeacherApiKeyValidationForm as ApiKeyCheckBeforeRegistration };
