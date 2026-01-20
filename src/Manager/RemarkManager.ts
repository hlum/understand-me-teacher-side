import { LollipopHelper } from "@/Helper/LollipopHelper.js";
import type { RemarkManagerInterface } from "@/ManagerInterface/RemarkManagerInterface.js";

export class RemarkManager implements RemarkManagerInterface {
	async remark(newScore: number, homeworkID: string, studentID: string, questionID: string, newCorrectChoiceID: string): Promise<void> {
		await this.changeCorrectChoice(newCorrectChoiceID, questionID);
		await this.updateScore(newScore, homeworkID, studentID);
	}

	private async changeCorrectChoice(newCorrectChoiceID: string, questionID: string): Promise<void> {
		const context = "RemarkManager.changeCorrectChoice";
		const endpoint = LollipopHelper.instance.buildEndpoint("choices/update_correct_choice.php", {});
		const headers = await LollipopHelper.instance.buildHeaders(true);

		const body = JSON.stringify({
			question_id: questionID,
			new_correct_choice_id: newCorrectChoiceID,
		});

		const response = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endpoint, context, {
			method: "PATCH",
			headers: headers,
			body: body,
		});

		LollipopHelper.instance.validateLollipopResponse(response, context);
	}

	private async updateScore(newScore: number, homeworkID: string, studentID: string): Promise<void> {
		const context = "RemarkManager.updateScore";
		const endpoint = LollipopHelper.instance.buildEndpoint("result/update_score.php", {});
		const headers = await LollipopHelper.instance.buildHeaders(true);

		const body = JSON.stringify({
			homework_id: homeworkID,
			student_id: studentID,
			new_score: newScore,
		});

		const response = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endpoint, context, {
			method: "PATCH",
			headers: headers,
			body: body,
		});

		LollipopHelper.instance.validateLollipopResponse(response, context);
	}
}
