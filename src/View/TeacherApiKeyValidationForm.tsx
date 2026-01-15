import type { User } from "firebase/auth";
import { useTeacherAPIKeyValidationFormViewModel } from "../ViewModel/TeacherAPIKeyValidationFormViewModel.js";
import { AuthManager } from "@/Manager/AuthManager.js";

type TeacherApiKeyValidationFormProps = {
	authData: User;
};

const TeacherApiKeyValidationForm: React.FC<TeacherApiKeyValidationFormProps> = ({ authData }) => {
	const authManager = new AuthManager();
	const { teacherAPIKey, setTeacherAPIKey, loading, validateTeacherApiKey } = useTeacherAPIKeyValidationFormViewModel();

	return (
		<div className="page-bg flex items-center justify-center px-6 py-12">
			<div className="w-full max-w-md card p-10">
				<div className="text-center mb-8">
					<h2 className="heading-gradient mb-3">教師用APIキー認証</h2>
					<p className="text-adaptive-secondary text-sm">教師専用のAPIキーを入力してアカウントを登録してください</p>
				</div>

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
								validateTeacherApiKey(teacherAPIKey);
							}
						}}
					/>
				</div>

				<button
					onClick={() => validateTeacherApiKey(teacherAPIKey)}
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

				<div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
					<div className="flex flex-col items-center gap-3">
						<p className="text-xs text-adaptive-secondary text-center">
							ログイン中: <span className="font-medium">{authData.email}</span>
						</p>

						<button
							onClick={() => authManager.changeAccount()}
							className="
								px-4 py-2 text-sm
								bg-gray-100 dark:bg-gray-800
								hover:bg-gray-200 dark:hover:bg-gray-700
								text-gray-700 dark:text-gray-200
								rounded-lg
								border border-gray-300 dark:border-gray-600
								transition
							"
						>
							アカウントを切り替える
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export { TeacherApiKeyValidationForm as ApiKeyCheckBeforeRegistration };
