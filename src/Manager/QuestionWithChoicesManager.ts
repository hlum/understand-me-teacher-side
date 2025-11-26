import { type RawAnswerResponse, transformAnswerResponse, type Answer } from "@/Entity/Answer.js";
import { transformQuestionWithChoicesResponse, type QuestionWithChoices, type RawQuestionWithChoicesResponse } from "@/Entity/QuestionWithChoices.js";
import { LollipopHelper } from "@/Helper/LollipopHelper.js";
import type { QuestionWithChoicesManagerInterface } from "@/ManagerInterface/QuestionWithChoicesManagerInterface.js";

export class QuestionWithChoicesManager implements QuestionWithChoicesManagerInterface {
	async fetch(homeworkID: string, userID: string): Promise<QuestionWithChoices[]> {
		const context = "QuestionWithChoicesManager.fetch";
		const endpoint = LollipopHelper.instance.buildEndpoint("questions_choices/get_questions_choices.php", { homework_id: homeworkID, user_id: userID });

		const headers = LollipopHelper.instance.buildHeader();
		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endpoint, context, {
			method: "GET",
			headers: headers,
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, context, true);
		const rawData = LollipopHelper.instance.decodeDataFromLollipopResponse<RawQuestionWithChoicesResponse[]>(lollipopResponse.data!, context);

		return rawData.map(transformQuestionWithChoicesResponse);
	}

	async fetchUserAnswers(homeworkID: string, userID: string): Promise<Answer[]> {
		const context = "QuestionWithChoicesManager.fetchUserAnswer";
		const endpoint = LollipopHelper.instance.buildEndpoint("answer/get_answers_with_homeworkID.php", { homework_id: homeworkID, user_id: userID });

		const headers = LollipopHelper.instance.buildHeader();
		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endpoint, context, {
			method: "GET",
			headers: headers,
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, context, true);
		const rawData = LollipopHelper.instance.decodeDataFromLollipopResponse<RawAnswerResponse[]>(lollipopResponse.data!, context);

		return rawData.map(transformAnswerResponse);
	}
}
