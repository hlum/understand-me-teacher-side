import { type RawAnswerResponse, transformAnswerResponse, type Answer } from "@/Entity/Answer.js";
import { transformQuestionWithChoicesResponse, type QuestionWithChoices, type RawQuestionWithChoicesResponse } from "@/Entity/QuestionWithChoices.js";
import { DataParseError } from "@/Helper/CustomErrors.js";
import { LollipopHelper } from "@/Helper/LollipopHelper.js";
import type { QuestionWithChoicesManagerInterface } from "@/ManagerInterface/QuestionWithChoicesManagerInterface.js";

export class QuestionWithChoicesManager implements QuestionWithChoicesManagerInterface {
	async fetch(homeworkID: string, userID: string): Promise<QuestionWithChoices[]> {
		const context = "QuestionWithChoicesManager.fetch";
		const endpoint = LollipopHelper.instance.buildEndpoint("questions_choices/get_questions_choices.php", { homework_id: homeworkID, user_id: userID });
		const headers = await LollipopHelper.instance.buildHeaders();

		const response = await LollipopHelper.instance.fetchAndDecodeLollipopResponse<RawQuestionWithChoicesResponse[]>(endpoint, context, {
			method: "GET",
			headers: headers,
		});

		LollipopHelper.instance.validateLollipopResponse(response, context);

		if (!response.data) {
			throw new DataParseError(`${context}: レスポンスの中にdataが存在しません。`);
		}

		return response.data.map(transformQuestionWithChoicesResponse);
	}

	async fetchUserAnswers(homeworkID: string, userID: string): Promise<Answer[]> {
		const context = "QuestionWithChoicesManager.fetchUserAnswers";
		const endpoint = LollipopHelper.instance.buildEndpoint("answer/get_answers_with_homeworkID.php", { homework_id: homeworkID, user_id: userID });
		const headers = await LollipopHelper.instance.buildHeaders();

		const response = await LollipopHelper.instance.fetchAndDecodeLollipopResponse<RawAnswerResponse[]>(endpoint, context, {
			method: "GET",
			headers: headers,
		});

		LollipopHelper.instance.validateLollipopResponse(response, context);

		if (!response.data) {
			throw new DataParseError(`${context}: レスポンスの中にdataが存在しません。`);
		}

		return response.data.map(transformAnswerResponse);
	}
}
