import { useParams } from "react-router-dom";
import { useCreateHomeworkViewModel } from "../ViewModel/CreateHomeworkViewModel.js";
import { HomeworkManager } from "../Manager/HomeworkManager.js";
import { useRouteManager } from "../Router/useRouteManager.js";

export const CreateHomeworkPage = () => {
	const { classID } = useParams<{ classID: string }>();
	if (!classID) {
		return <div>Invalid class ID</div>;
	}
	const navigate = useRouteManager();
	const homeworkManager = new HomeworkManager();
	const vm = useCreateHomeworkViewModel(classID, homeworkManager);

	if (!vm) {
		alert("もう一度ログインしてください！");
		navigate.toLogin();
		return null;
	}

	const { title, setTitle, description, setDescription, dueDate, setDueDate, loading, addNewHomework } = vm;

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
						<textarea rows={4} placeholder="課題の詳細を入力してください..." value={description} onChange={(e) => setDescription(e.target.value)} className="input resize-none" />
					</div>

					<div>
						<label className="block text-adaptive-secondary mb-2 font-medium">締め切り日</label>
						<input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input" />
					</div>

					{/* Submit Button */}
					<button
						onClick={addNewHomework}
						disabled={loading}
						className={`w-full mt-6 py-3 rounded-lg font-semibold text-white text-lg transition-all duration-300 ${
							loading
								? "btn-disabled opacity-70"
								: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.7)] hover:-translate-y-0.5"
						}`}
					>
						{loading ? "追加中..." : "課題を追加"}
					</button>
				</div>
			</div>
		</div>
	);
};
