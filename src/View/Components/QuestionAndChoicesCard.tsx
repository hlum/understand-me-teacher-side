import { type QuestionAndChoicesAndUserSelectedChoice } from "@/Entity/QuestionWithChoices.js";
import { useState } from "react";

type QuestionAndChoicesCardProps = {
	questionAndChoicesAndUserSelectedChoice: QuestionAndChoicesAndUserSelectedChoice;
	index: number;
	newCorrectChoiceSelected: (choiceID: string) => void;
};

export const QuestionAndChoicesCard = ({ questionAndChoicesAndUserSelectedChoice, index, newCorrectChoiceSelected }: QuestionAndChoicesCardProps) => {
	const [editing, setEditing] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [tempCorrectChoiceID, setTempCorrectChoiceID] = useState<string>(questionAndChoicesAndUserSelectedChoice.choices.find((c) => c.isCorrect)?.id || "");

	const handleSave = () => {
		const currentCorrectChoiceID = questionAndChoicesAndUserSelectedChoice.choices.find((c) => c.isCorrect)?.id || "";
		if (tempCorrectChoiceID === currentCorrectChoiceID) {
			// 変更がない場合は何もしない
			setEditing(false);
			return;
		}

		if (tempCorrectChoiceID) {
			setShowConfirmModal(true);
		}
	};

	const handleConfirm = () => {
		newCorrectChoiceSelected(tempCorrectChoiceID);
		setShowConfirmModal(false);
		setEditing(false);
	};

	const handleCancelConfirm = () => {
		setShowConfirmModal(false);
	};

	const handleCancel = () => {
		setTempCorrectChoiceID(questionAndChoicesAndUserSelectedChoice.choices.find((c) => c.isCorrect)?.id || "");
		setEditing(false);
	};

	return (
		<>
			<div key={questionAndChoicesAndUserSelectedChoice.id} className="card p-4 sm:p-5 rounded-xl bg-bg-secondary shadow-sm border border-bg-secondary/50">
				{/* Header with Question and Edit Button */}
				<div className="mb-4">
					<div className="flex items-start gap-3">
						<span className="text-primary font-bold text-lg">Q{index + 1}</span>
						<h3 className="text-adaptive font-semibold text-base leading-relaxed flex-1">{questionAndChoicesAndUserSelectedChoice.questionText}</h3>
						{!editing && (
							<button onClick={() => setEditing(true)} className="text-adaptive-secondary hover:text-primary transition-colors p-1 rounded" aria-label="Edit answer">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
								</svg>
							</button>
						)}
					</div>
				</div>

				{/* Choices */}
				<div className="space-y-2 pl-9">
					{questionAndChoicesAndUserSelectedChoice.choices.map((choice) => {
						const isUserSelected = choice.id === questionAndChoicesAndUserSelectedChoice.userSelectedChoiceID;
						const isCorrect = editing ? choice.id === tempCorrectChoiceID : choice.isCorrect;

						let bgClass = "bg-bg-secondary";
						let textClass = "text-adaptive-secondary";

						if (!editing) {
							if (isUserSelected && !isCorrect) {
								bgClass = "border border-red-400";
							} else if (isCorrect) {
								bgClass = "border border-green-400";
							}
						} else {
							if (isCorrect) {
								bgClass = "border border-green-400";
							}
						}

						const handleClick = () => {
							if (editing) {
								setTempCorrectChoiceID(choice.id);
							}
						};

						return (
							<div key={choice.id} onClick={handleClick} className={`flex items-start gap-2 p-2 rounded-lg ${bgClass} ${editing ? "cursor-pointer" : ""}`}>
								{editing && (
									<div className="flex items-center justify-center w-5 h-5">
										<div className={`w-4 h-4 rounded-full border-2 ${isCorrect ? "border-green-500 bg-green-500" : "border-adaptive-secondary"} flex items-center justify-center`}>
											{isCorrect && <div className="w-2 h-2 rounded-full bg-white"></div>}
										</div>
									</div>
								)}
								<p className={`flex-1 text-sm leading-relaxed ${textClass}`}>{choice.choiceText}</p>
								{!editing && isCorrect && (
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
										<circle cx="12" cy="12" r="12" fill="#10B981" />
										<path d="M16.5 9l-5.25 5.25L7.5 12" stroke="white" />
									</svg>
								)}
								{!editing && isUserSelected && !isCorrect && (
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
										<circle cx="12" cy="12" r="12" fill="#EF4444" />
										<path d="M15 9l-6 6M9 9l6 6" stroke="white" />
									</svg>
								)}
							</div>
						);
					})}
				</div>

				{/* Edit Mode Actions */}
				{editing && (
					<div className="flex gap-2 justify-end mt-4 pl-9">
						<button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-adaptive bg-bg-secondary border border-bg-secondary rounded-lg">
							キャンセル
						</button>
						<button onClick={handleSave} disabled={!tempCorrectChoiceID} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg disabled:opacity-50">
							変更する
						</button>
					</div>
				)}
			</div>

			{/* Confirmation Modal */}
			{showConfirmModal && (
				<div className="fixed inset-0 flex items-center justify-center p-4 bg-black/75">
					<div className="bg-bg-secondary rounded-xl max-w-md w-full p-6 border border-bg-secondary">
						<h3 className="text-adaptive font-semibold text-lg mb-2">確認</h3>
						<p className="text-adaptive-secondary text-sm mb-6">
							本当に正解の選択肢を変更しますか？ <br /> 変更後に点数は自動で更新されます。
						</p>
						<div className="flex gap-3 justify-end">
							<button onClick={handleCancelConfirm} className="text-red-400 px-4 py-2 text-sm font-medium">
								キャンセル
							</button>
							<button onClick={handleConfirm} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg">
								変更
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
