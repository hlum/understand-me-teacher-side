import { LollipopHelper } from "@/Helper/LollipopHelper.js";
import type { RemarkManagerInterface } from "@/ManagerInterface/RemarkManagerInterface.js";

export class RemarkManager implements RemarkManagerInterface {
	async remark(newScore: number, homeworkID: string, studentID: string, questionID: string, newCorrectChoiceID: string): Promise<void> {
		await this.changeCorrectChoice(newCorrectChoiceID, questionID);
		await this.updateScore(newScore, homeworkID, studentID);
	}

	private async changeCorrectChoice(newCorrectChoiceID: string, questionID: string): Promise<void> {
		const context = "RemarkManager.changeCorrectChoice";
		const endPoint = LollipopHelper.instance.buildEndpoint("choices/update_correct_choice.php", {});
		const headers = LollipopHelper.instance.buildHeader(true);
		const body = JSON.stringify({
			question_id: questionID,
			new_correct_choice_id: newCorrectChoiceID,
		});

		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endPoint, context, {
			method: "PATCH",
			headers: headers,
			body: body,
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, context);
		console.log("✅ 正解の選択肢を変更しました。");
	}

	private async updateScore(newScore: number, homeworkID: string, studentID: string): Promise<void> {
		const context = "RemarkManager.updateScore";
		const endPoint = LollipopHelper.instance.buildEndpoint("result/update_score.php", {});
		const headers = LollipopHelper.instance.buildHeader(true);
		const body = JSON.stringify({
			homework_id: homeworkID,
			student_id: studentID,
			new_score: newScore,
		});
		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endPoint, context, {
			method: "PATCH",
			headers: headers,
			body: body,
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, context);
		console.log("✅ スコアを更新しました。");
	}
}
