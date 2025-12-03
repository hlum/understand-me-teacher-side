import type { HomeworkWithSubmissionStatus } from "@/Entity/Homework.js";

type GeneralInformationOfSubmissionProps = {
	selectedSubmissionStatus: HomeworkWithSubmissionStatus;
};

export const GeneralInformationOfSubmission = ({ selectedSubmissionStatus }: GeneralInformationOfSubmissionProps) => {
	return (
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

				{/* 提出日時 */}
				{selectedSubmissionStatus.submittedAt && (
					<div>
						<label className="text-adaptive-secondary text-sm font-medium">提出日時</label>
						<p className="text-adaptive mt-1">{selectedSubmissionStatus.submittedAt}</p>
					</div>
				)}

				{/* GitHub リンク */}
				<div>
					<label className="text-adaptive-secondary text-sm font-medium">GitHub ファイル</label>
					{selectedSubmissionStatus.githubFileLink ? (
						<a href={selectedSubmissionStatus.githubFileLink} target="_blank" rel="noopener noreferrer" className="text-primary-light hover:underline mt-1 block break-all">
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
	);
};
