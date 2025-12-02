import type { HomeworkWithSubmissionStatus } from "@/Entity/Homework.js";

type HomeworkStatusItemProps = {
	homeworkWithSubmissionStatus: HomeworkWithSubmissionStatus;
	isSelected: boolean;
	onSelected: (hw: HomeworkWithSubmissionStatus) => void;
};

export const HomeworkStatusItem = ({ homeworkWithSubmissionStatus, isSelected, onSelected }: HomeworkStatusItemProps) => {
	return (
		<div
			key={homeworkWithSubmissionStatus.userStudentID}
			className={`card-hover ${isSelected ? "ring-2 ring-blue-500" : ""}`}
			onClick={() => {
				onSelected(homeworkWithSubmissionStatus);
			}}
		>
			{/* 学籍番号 */}
			<div className="flex items-center justify-between mb-3">
				<span className="text-adaptive font-semibold text-lg">{homeworkWithSubmissionStatus.userStudentID}</span>
				{/* スコア表示 */}
				<span
					className={`text-2xl font-bold ${
						homeworkWithSubmissionStatus.score >= 80 ? "text-accent-light" : homeworkWithSubmissionStatus.score >= 60 ? "text-primary-light" : "text-red-500"
					}`}
				>
					{homeworkWithSubmissionStatus.score}/100
				</span>
			</div>

			{/* 提出状態バッジ */}
			<div className="flex items-center gap-2">
				<span className="text-adaptive-secondary text-sm">提出状態:</span>
				{homeworkWithSubmissionStatus.submissionState === "completed" ? (
					<span className="badge-green">✓ 提出済み</span>
				) : homeworkWithSubmissionStatus.submissionState === "generatingQuestions" ? (
					<span className="badge-blue">⌛ 質問生成中</span>
				) : homeworkWithSubmissionStatus.submissionState === "questionGenerated" ? (
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
	);
};
