import { useParams } from "react-router-dom";
import { useHomeworkStatusViewModel } from "../ViewModel/HomeworkStatusViewModel.js";
import { Loading } from "./Components/Loading.js";
import { HomeworkManager } from "../Manager/HomeworkManager.js";
import { useState } from "react";
import type { HomeworkWithSubmissionStatus } from "@/Entity/Homework.js";
import { QuestionWithChoicesManager } from "@/Manager/QuestionWithChoicesManager.js";

export const StudentHomeworkStatusView = () => {
	const { homeworkID } = useParams<{ homeworkID: string }>();

	if (!homeworkID) {
		return <div>Invalid homework ID</div>;
	}

	const homeworkManager = new HomeworkManager();
	const questionWithChoicesManager = new QuestionWithChoicesManager();
	const { loading, homeworkStatusList, questionWithChoices, selectedSubmissionStatus, onSelected } = useHomeworkStatusViewModel(homeworkID, homeworkManager, questionWithChoicesManager);

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
							<div
								key={hw.userStudentID}
								className={`card-hover ${selectedSubmissionStatus?.userStudentID === hw.userStudentID ? "ring-2 ring-blue-500" : ""}`}
								onClick={() => {
									onSelected(hw);
								}}
							>
								{/* 学籍番号 */}
								<div className="flex items-center justify-between mb-3">
									<span className="text-adaptive font-semibold text-lg">{hw.userStudentID}</span>
									{/* スコア表示 */}
									<span className={`text-2xl font-bold ${hw.score >= 80 ? "text-accent-light" : hw.score >= 60 ? "text-primary-light" : "text-red-500"}`}>{hw.score}/100</span>
								</div>

								{/* 提出状態バッジ */}
								<div className="flex items-center gap-2">
									<span className="text-adaptive-secondary text-sm">提出状態:</span>
									{hw.submissionState === "completed" ? (
										<span className="badge-green">✓ 提出済み</span>
									) : hw.submissionState === "generatingQuestions" ? (
										<span className="badge-blue">⌛ 質問生成中</span>
									) : hw.submissionState === "questionGenerated" ? (
										<span className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-md text-sm font-semibold border border-yellow-300 dark:border-yellow-700">
											📝 回答未提出
										</span>
									) : (
										<span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-md text-sm font-semibold border border-gray-300 dark:border-gray-600">
											○ 未提出
										</span>
									)}
								</div>
							</div>
						))}
					</div>

					{/* 右側：詳細情報（スクロール可能） */}
					<div className="lg:sticky lg:top-8 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
						{selectedSubmissionStatus ? (
							<div className="space-y-4">
								{/* 基本情報カード */}
								<div className="card animate-fade-in">
									<h2 className="text-adaptive text-xl font-semibold mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">基本情報</h2>

									<div className="space-y-3">
										{/* 学生情報 */}
										<div>
											<label className="text-adaptive-secondary text-sm font-medium">学籍番号</label>
											<p className="text-adaptive text-lg font-semibold mt-1">{selectedSubmissionStatus.userStudentID}</p>
										</div>

										{/* 提出期限 */}
										<div>
											<label className="text-adaptive-secondary text-sm font-medium">提出期限</label>
											<p className="text-adaptive mt-1">{selectedSubmissionStatus.dueDate || "期限なし"}</p>
										</div>

										{/* GitHub リンク */}
										<div>
											<label className="text-adaptive-secondary text-sm font-medium">GitHub ファイル</label>
											{selectedSubmissionStatus.githubFileLink ? (
												<a
													href={selectedSubmissionStatus.githubFileLink}
													target="_blank"
													rel="noopener noreferrer"
													className="text-primary-light hover:underline mt-1 block break-all"
												>
													{selectedSubmissionStatus.githubFileLink}
												</a>
											) : (
												<p className="text-adaptive-secondary mt-1">リンクなし</p>
											)}
										</div>

										{/* スコア */}
										<div className="pt-3 border-t border-gray-200 dark:border-gray-700">
											<label className="text-adaptive-secondary text-sm font-medium">スコア</label>
											<p
												className={`text-4xl font-bold mt-2 ${
													selectedSubmissionStatus.score >= 80 ? "text-accent-light" : selectedSubmissionStatus.score >= 60 ? "text-primary-light" : "text-red-500"
												}`}
											>
												{selectedSubmissionStatus.score} <span className="text-2xl text-adaptive-secondary">/ 100</span>
											</p>
										</div>

										{/* 提出状態 */}
										<div>
											<label className="text-adaptive-secondary text-sm font-medium">提出状態</label>
											<div className="mt-2">
												{selectedSubmissionStatus.submissionState === "completed" ? (
													<span className="badge-green text-base">✓ 提出済み</span>
												) : selectedSubmissionStatus.submissionState === "generatingQuestions" ? (
													<span className="badge-blue text-base">⌛ 質問生成中</span>
												) : selectedSubmissionStatus.submissionState === "questionGenerated" ? (
													<span className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-md text-base font-semibold border border-yellow-300 dark:border-yellow-700">
														📝 回答未提出
													</span>
												) : (
													<span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-base font-semibold border border-gray-300 dark:border-gray-600">
														○ 未提出
													</span>
												)}
											</div>
										</div>
									</div>
								</div>

								{/* 質問と回答カード群 */}
								<div className="space-y-4">
									<h2 className="text-adaptive text-xl font-semibold">質問と回答</h2>
									{[{ id: "asfd", question: "question", answer: "answer" }].map((qa, index) => (
										<div key={qa.id} className="card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
											{/* 質問 */}
											<div className="mb-4">
												<div className="flex items-start gap-2 mb-2">
													<span className="text-primary-light font-bold text-lg">Q{qa.id}.</span>
													<h3 className="text-adaptive font-semibold text-base flex-1">{qa.question}</h3>
												</div>
											</div>

											{/* 回答 */}
											<div className="pl-7">
												<div className="flex items-start gap-2">
													<span className="text-accent-light font-bold">A.</span>
													<p className="text-adaptive-secondary text-sm leading-relaxed flex-1">{qa.answer}</p>
												</div>
											</div>
										</div>
									))}
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
