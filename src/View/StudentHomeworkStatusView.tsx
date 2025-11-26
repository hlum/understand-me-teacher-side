import { useParams } from "react-router-dom";
import { useHomeworkStatusViewModel } from "../ViewModel/HomeworkStatusViewModel.js";
import { Loading } from "./Components/Loading.js";
import { HomeworkManager } from "../Manager/HomeworkManager.js";
import { useState } from "react";
import type { HomeworkWithSubmissionStatus } from "@/Entity/Homework.js";
import { QuestionWithChoicesManager } from "@/Manager/QuestionWithChoicesManager.js";
import { QuestionAndChoicesCard } from "./Components/QuestionAndChoicesCard.js";
import { GeneralInformationOfSubmission } from "./Components/GeneralInformationOfSubmission.js";
import { HomeworkStatusItem } from "./Components/HomeworkStatusItem.js";

export const StudentHomeworkStatusView = () => {
	const { homeworkID } = useParams<{ homeworkID: string }>();

	if (!homeworkID) {
		return <div>Invalid homework ID</div>;
	}

	const homeworkManager = new HomeworkManager();
	const questionWithChoicesManager = new QuestionWithChoicesManager();
	const { loading, homeworkStatusList, questionAndChoicesAndUserSelectedChoice, selectedSubmissionStatus, onSelected } = useHomeworkStatusViewModel(
		homeworkID,
		homeworkManager,
		questionWithChoicesManager
	);

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
							<HomeworkStatusItem homeworkWithSubmissionStatus={hw} selectedSubmissionStatus={selectedSubmissionStatus} onSelected={onSelected} key={hw.userStudentID} />
						))}
					</div>

					{/* 右側：詳細情報（スクロール可能） */}
					<div className="lg:sticky lg:top-8 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
						{selectedSubmissionStatus ? (
							<div className="space-y-4">
								{/* 基本情報カード */}
								<GeneralInformationOfSubmission selectedSubmissionStatus={selectedSubmissionStatus} />

								{/* 質問と回答カード群 */}
								<div className="space-y-6">
									<h2 className="text-xl font-semibold text-adaptive">質問と回答</h2>

									{questionAndChoicesAndUserSelectedChoice.map((qa, index) => (
										<QuestionAndChoicesCard questionAndChoicesAndUserSelectedChoice={qa} index={index} key={qa.id} />
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
