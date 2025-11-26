export type Answer = {
	id: string;
	questionID: string;
	userID: string;
	selectedChoiceID: string;
};

export type RawAnswerResponse = {
	id: string;
	question_id: string;
	user_id: string;
	selected_choice_id: string;
};

export const transformAnswerResponse = (raw: RawAnswerResponse): Answer => ({
	id: raw.id,
	questionID: raw.question_id,
	userID: raw.user_id,
	selectedChoiceID: raw.selected_choice_id,
});
