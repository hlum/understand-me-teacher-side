import { HomeworkManager } from "@/Manager/HomeworkManager.js";
import { useEditHomeworkViewModel } from "@/ViewModel/EditHomeworkViewModel.js";
import type { User } from "firebase/auth";
import { useParams } from "react-router-dom";
import { Loading } from "./Components/Loading.js";

type EditHomeworkViewProps = {
	authData: User;
};
export const EditHomeworkView = ({ authData }: EditHomeworkViewProps) => {
	const { homeworkID } = useParams<{ homeworkID: string }>();

	if (!homeworkID) {
		// TODO: 404ページにリダイレクト
		return <div>404 Not Found</div>;
	}

	const homeworkManager = new HomeworkManager();
	const { originalHomework, title, setTitle, description, setDescription, dueDate, setDueDate, loading, isUpdating, updateHomework } = useEditHomeworkViewModel(
		authData,
		homeworkID,
		homeworkManager
	);

	if (loading) {
		return <Loading />;
	}

	if (!originalHomework) {
		return <div>課題の情報を取得できませんでした。</div>;
	}

	return (
		<div className="page-bg flex items-center justify-center p-6">
			<div className="w-full max-w-lg card p-8">
				{/* Header */}
				<h2 className="text-3xl font-bold text-center text-adaptive mb-6 tracking-wide">課題追加ページ</h2>

				{/* Info */}
				<div className="mb-6 text-center text-gray-300 text-sm space-y-1"></div>

				{/* Form */}
				<div className="space-y-5">
					<div>
						<label className="block text-adaptive-secondary mb-2 font-medium">課題名</label>
						<input type="text" placeholder="例: 第1章 課題レポート" value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
					</div>

					<div>
						<label className="block text-adaptive-secondary mb-2 font-medium">課題の説明</label>
						<textarea rows={4} placeholder="課題の詳細を入力してください..." value={description ?? ""} onChange={(e) => setDescription(e.target.value)} className="input resize-none" />
					</div>

					<div>
						<label className="block text-adaptive-secondary mb-2 font-medium">締め切り日</label>
						<input type="date" value={dueDate ?? ""} onChange={(e) => setDueDate(e.target.value)} className="input" />
					</div>

					{/* Submit Button */}
					<button
						onClick={updateHomework}
						disabled={isUpdating}
						className={`w-full mt-6 py-3 rounded-lg font-semibold text-white text-lg transition-all duration-300 ${
							isUpdating
								? "btn-disabled opacity-70"
								: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.7)] hover:-translate-y-0.5"
						}`}
					>
						{isUpdating ? "更新中..." : "課題を更新"}
					</button>
				</div>
			</div>
		</div>
	);
};
