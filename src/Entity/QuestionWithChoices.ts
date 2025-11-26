export type QuestionWithChoices = {
	id: string;
	jobID: string;
	projectID: string;
	homeworkID: string;
	userID: string;
	questionText: string;
	createdAt: string;
	choices: Choice[];
};

export type RawQuestionWithChoicesResponse = {
	id: string;
	job_id: string;
	project_id: string;
	homework_id: string;
	user_id: string;
	question_text: string;
	created_at: string;
	choices: RawChoiceResponse[];
};

export const transformQuestionWithChoicesResponse = (raw: RawQuestionWithChoicesResponse): QuestionWithChoices => ({
	id: raw.id,
	jobID: raw.job_id,
	projectID: raw.project_id,
	homeworkID: raw.homework_id,
	userID: raw.user_id,
	questionText: raw.question_text,
	createdAt: raw.created_at,
	choices: raw.choices.map((choice) => ({
		id: choice.id,
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
	id: string;
	choice_text: string;
	is_correct: boolean;
};
