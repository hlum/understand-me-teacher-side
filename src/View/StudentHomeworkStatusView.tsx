import { useParams } from "react-router-dom";
import { useHomeworkStatusViewModel } from "../ViewModel/HomeworkStatusViewModel.js";
import { Loading } from "./Components/Loading.js";
import { HomeworkManager } from "../Manager/HomeworkManager.js";
import { useState } from "react";
import type { HomeworkWithSubmissionStatus } from "@/Entity/Homework.js";

export const StudentHomeworkStatusView = () => {
	const { homeworkID } = useParams<{ homeworkID: string }>();
	const [selectedStudent, setSelectedStudent] = useState<HomeworkWithSubmissionStatus | null>(null);

	if (!homeworkID) {
		return <div>Invalid homework ID</div>;
	}

	const homeworkManager = new HomeworkManager();
	const { loading, homeworkStatusList } = useHomeworkStatusViewModel(homeworkID, homeworkManager);

	if (loading) return <Loading />;

	return (
		<div className="page-bg min-h-screen p-8">
			<div className="max-w-7xl mx-auto">
				{/* ページタイトル */}
				<h1 className="heading-gradient mb-8 text-center">学生ごとの進捗</h1>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* 左側：学生リスト */}
					<div className="space-y-4">
						<h2 className="text-adaptive text-xl font-semibold mb-4">学生一覧</h2>
						{homeworkStatusList.map((hw) => (
							<div key={hw.userID} className={`card-hover ${selectedStudent?.id === hw.userID ? "ring-2 ring-blue-500" : ""}`} onClick={() => setSelectedStudent(hw)}>
								{/* メールアドレス */}
								<div className="flex items-center justify-between mb-3">
									<span className="text-adaptive font-semibold text-lg">{hw.userStudentID}</span>
									{/* スコア表示 */}
									<span className={`text-2xl font-bold ${hw.score >= 80 ? "text-accent-light" : hw.score >= 60 ? "text-primary-light" : "text-red-500"}`}>{hw.score}/100</span>
								</div>

								{/* 提出状態バッジ */}
								<div className="flex items-center gap-2">
									<span className="text-adaptive-secondary text-sm">提出状態:</span>
									{hw.submissionState === "completed" ? (
										<span className="badge-green">提出済み</span>
									) : hw.submissionState === "generatingQuestions" ? (
										<span className="badge-blue">⌛ 質問生成中</span>
									) : hw.submissionState === "questionGenerated" ? (
										<span className="badge-yellow">回答未提出</span>
									) : (
										<span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-base font-semibold border border-gray-300 dark:border-gray-600">
											○ 未提出
										</span>
									)}
								</div>
							</div>
						))}
					</div>

					{/* 右側：詳細情報 */}
					<div className="lg:sticky lg:top-8 lg:self-start">
						{selectedStudent ? (
							<div className="card animate-fade-in">
								<h2 className="text-adaptive text-xl font-semibold mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">詳細情報</h2>

								<div className="space-y-4">
									{/* 学生情報 */}
									<div>
										<label className="text-adaptive-secondary text-sm font-medium">学生</label>
										<p className="text-adaptive text-lg font-semibold mt-1">{selectedStudent.userStudentID}</p>
									</div>

									{/* 提出期限 */}
									<div>
										<label className="text-adaptive-secondary text-sm font-medium">提出期限</label>
										<p className="text-adaptive mt-1">{selectedStudent.dueDate || "期限なし"}</p>
									</div>

									{/* GitHub リンク */}
									<div>
										<label className="text-adaptive-secondary text-sm font-medium">GitHub ファイル</label>
										{selectedStudent.githubFileLink ? (
											<a href={selectedStudent.githubFileLink} target="_blank" rel="noopener noreferrer" className="text-primary-light hover:underline mt-1 block break-all">
												{selectedStudent.githubFileLink}
											</a>
										) : (
											<p className="text-adaptive-secondary mt-1">リンクなし</p>
										)}
									</div>

									{/* スコア */}
									<div className="pt-4 border-t border-gray-200 dark:border-gray-700">
										<label className="text-adaptive-secondary text-sm font-medium">スコア</label>
										<p
											className={`text-4xl font-bold mt-2 ${
												selectedStudent.score >= 80 ? "text-accent-light" : selectedStudent.score >= 60 ? "text-primary-light" : "text-red-500"
											}`}
										>
											{selectedStudent.score} <span className="text-2xl text-adaptive-secondary">/ 100</span>
										</p>
									</div>

									{/* 提出状態 */}
									<div>
										<label className="text-adaptive-secondary text-sm font-medium">提出状態</label>
										<div className="mt-2">
											{selectedStudent.submissionState === "completed" ? (
												<span className="badge-green">提出済み</span>
											) : selectedStudent.submissionState === "generatingQuestions" ? (
												<span className="badge-blue">⌛ 質問生成中</span>
											) : selectedStudent.submissionState === "questionGenerated" ? (
												<span className="badge-yellow">回答未提出</span>
											) : (
												<span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-base font-semibold border border-gray-300 dark:border-gray-600">
													○ 未提出
												</span>
											)}
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className="card text-center">
								<p className="text-adaptive-secondary text-lg">学生を選択して詳細を表示</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
