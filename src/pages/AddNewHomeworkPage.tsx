import React from "react";
import { useLocation } from "react-router-dom";
import { addNewHomework } from "../api/HomeworksOperations.js";

export const AddNewHomeworkPage = () => {
	const location = useLocation();
	const { classID, teacherID } = location.state || {};
	const [title, setTitle] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [dueDate, setDueDate] = React.useState("");
	const [loading, setLoading] = React.useState(false);

	const handleSubmit = async () => {
		// TODO : 締切の日を過去日や今日に設定できないようにする
		if (!title || !dueDate) {
			alert("課題名と締め切り日は必須です。");
			return;
		}

		try {
			setLoading(true);
			await addNewHomework(
				classID,
				teacherID,
				title,
				description,
				dueDate
			);
			alert("課題を追加しました ✅");
			setTitle("");
			setDescription("");
			setDueDate("");
		} catch (error) {
			alert("課題の追加に失敗しました。");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-900 flex items-center justify-center p-6">
			<div className="w-full max-w-lg backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
				{/* Header */}
				<h2 className="text-3xl font-bold text-center text-white mb-6 tracking-wide">
					課題追加ページ
				</h2>

				{/* Info */}
				<div className="mb-6 text-center text-gray-300 text-sm space-y-1"></div>

				{/* Form */}
				<div className="space-y-5">
					<div>
						<label className="block text-gray-200 mb-2 font-medium">
							課題名
						</label>
						<input
							type="text"
							placeholder="例: 第1章 課題レポート"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full px-4 py-3 rounded-lg bg-gray-900/40 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
						/>
					</div>

					<div>
						<label className="block text-gray-200 mb-2 font-medium">
							課題の説明
						</label>
						<textarea
							rows={4}
							placeholder="課題の詳細を入力してください..."
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full px-4 py-3 rounded-lg bg-gray-900/40 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
						/>
					</div>

					<div>
						<label className="block text-gray-200 mb-2 font-medium">
							締め切り日
						</label>
						<input
							type="date"
							value={dueDate}
							onChange={(e) => setDueDate(e.target.value)}
							className="w-full px-4 py-3 rounded-lg bg-gray-900/40 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
						/>
					</div>

					{/* Submit Button */}
					<button
						onClick={handleSubmit}
						disabled={loading}
						className={`w-full mt-6 py-3 rounded-lg font-semibold text-white text-lg
              bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
              hover:from-indigo-600 hover:to-blue-600
              shadow-[0_0_20px_rgba(59,130,246,0.5)]
              transition-all duration-300 ease-in-out
              ${
					loading
						? "opacity-70 cursor-not-allowed"
						: "hover:shadow-[0_0_40px_rgba(59,130,246,0.7)] hover:-translate-y-0.5"
				}`}
					>
						{loading ? "追加中..." : "課題を追加"}
					</button>
				</div>
			</div>
		</div>
	);
};
