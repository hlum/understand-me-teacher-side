import { type QuestionAndChoicesAndUserSelectedChoice } from "@/Entity/QuestionWithChoices.js";

type QuestionAndChoicesCardProps = {
	questionAndChoicesAndUserSelectedChoice: QuestionAndChoicesAndUserSelectedChoice;
	index: number;
};

export const QuestionAndChoicesCard = ({ questionAndChoicesAndUserSelectedChoice, index }: QuestionAndChoicesCardProps) => {
	return (
		<div
			key={questionAndChoicesAndUserSelectedChoice.id}
			className="card animate-fade-in p-4 sm:p-5 rounded-xl bg-bg-secondary shadow-sm border border-bg-secondary/50"
			style={{ animationDelay: `${index * 0.08}s` }}
		>
			{/* 質問 */}
			<div className="mb-4">
				<div className="flex items-start gap-3">
					<span className="text-primary font-bold text-lg">Q{index + 1}</span>

					<h3 className="text-adaptive font-semibold text-base leading-relaxed flex-1">{questionAndChoicesAndUserSelectedChoice.questionText}</h3>
				</div>
			</div>
			{/* 選択肢一覧 */}
			<div className="space-y-2 pl-9">
				{questionAndChoicesAndUserSelectedChoice.choices.map((choice) => {
					const isSelected = choice.id === questionAndChoicesAndUserSelectedChoice.userSelectedChoiceID;
					const isCorrect = choice.isCorrect;

					// 色の決定
					let bgClass = "bg-bg-secondary";
					let textClass = "text-adaptive-secondary";

					if (isSelected && !isCorrect) {
						// ユーザーが選んで間違った場合
						bgClass = "border border-red-400";
					} else if (isCorrect) {
						// 正解の選択肢
						bgClass = "border border-green-400";
					}

					return (
						<div key={choice.id} className={`flex items-start gap-2 p-2 rounded-lg ${bgClass}`}>
							<div className={`font-bold ${textClass}`}></div>
							<p className={`flex-1 text-sm leading-relaxed ${textClass}`}>{choice.choiceText}</p>
							{isCorrect && (
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
									<circle cx="12" cy="12" r="12" fill="#10B981" />
									<path d="M16.5 9l-5.25 5.25L7.5 12" stroke="white" />
								</svg>
							)}

							{isSelected && !isCorrect && (
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
									<circle cx="12" cy="12" r="12" fill="#EF4444" />
									<path d="M15 9l-6 6M9 9l6 6" stroke="white" />
								</svg>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};
