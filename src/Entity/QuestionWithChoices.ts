export type QuestionWithChoices = {
	questionID: string;
	jobID: string;
	projectID: string;
	homeworkID: string;
	userID: string;
	questionText: string;
	createdAt: string;
	choices: Choice[];
};

export type RawQuestionWithChoicesResponse = {
	question_id: string;
	job_id: string;
	project_id: string;
	homework_id: string;
	user_id: string;
	question_text: string;
	created_at: string;
	choices: RawChoiceResponse[];
};

export const transformQuestionWithChoicesResponse = (raw: RawQuestionWithChoicesResponse): QuestionWithChoices => ({
	questionID: raw.question_id,
	jobID: raw.job_id,
	projectID: raw.project_id,
	homeworkID: raw.homework_id,
	userID: raw.user_id,
	questionText: raw.question_text,
	createdAt: raw.created_at,
	choices: raw.choices.map((choice) => ({
		id: choice.choice_id,
		choiceText: choice.choice_text,
		isCorrect: choice.is_correct,
	})),
});

export type Choice = {
	id: string;
	choiceText: string;
	isCorrect: boolean;
};

export type RawChoiceResponse = {
	choice_id: string;
	choice_text: string;
	is_correct: boolean;
};

export type QuestionAndChoicesAndUserSelectedChoice = {
	id: string;
	questionText: string;
	choices: Choice[];
	userSelectedChoiceID: string;
};

// ← バグ修正：正しいオブジェクト生成
export const createQuestionAndChoicesAndUserSelectedChoice = (id: string, questionText: string, choices: Choice[], userSelectedChoiceID: string): QuestionAndChoicesAndUserSelectedChoice => ({
	id,
	questionText,
	choices,
	userSelectedChoiceID,
});
