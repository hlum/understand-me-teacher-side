import type { Answer } from "@/Entity/Answer.js";
import type { QuestionWithChoices } from "@/Entity/QuestionWithChoices.js";

export interface QuestionWithChoicesManagerInterface {
	/**
	 * 生成された選択式質問を取得します。
	 * @param homeworkID
	 * @param userID
	 * @throws APIError, NetworkError, DataParseError
	 */
	fetch(homeworkID: string, userID: string): Promise<QuestionWithChoices[]>;
	fetchUserAnswers(homeworkID: string, userID: string): Promise<Answer[]>;
}
