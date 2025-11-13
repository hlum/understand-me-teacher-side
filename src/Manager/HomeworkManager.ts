import {
	type Homework,
	type HomeworkWithSubmissionStatus,
	transformHomeworkWithSubmissionStatusResponse,
	transformHomeworkResponse,
	type RawHomeworkResponse,
	type RawHomeworkWithSubmissionStatusResponse,
} from "../Entity/Homework.js";
import { LollipopHelper } from "../Helper/LollipopHelper.js";
import { type HomeworkManagerInterface } from "../ManagerInterface/HomeworkManagerInterface.js";

export class HomeworkManager implements HomeworkManagerInterface {
	/**
	 * 科目の課題リストを取得します。
	 * @param classID 科目ID
	 * @returns 課題の配列
	 * @throws APIError, NetworkError, DataParseError
	 */
	async fetchHomeworkListForClass(classID: string): Promise<Homework[]> {
		const API_KEY = import.meta.env.VITE_API_KEY as string;
		const endPoint = LollipopHelper.instance.buildEndpoint("/homework/get_homework.php", { class_id: classID });

		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endPoint, "HomeworkManager.fetchHomeworkListForClass", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: API_KEY,
			},
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, "HomeworkManager.fetchHomeworkListForClass", true);
		const homeworks = LollipopHelper.instance.decodeDataFromLollipopResponse<RawHomeworkResponse[]>(lollipopResponse.data!, "HomeworkManager.fetchHomeworkListForClass");

		return homeworks.map(transformHomeworkResponse);
	}

	/**
	 *
	 * @param classID 科目ID
	 * @param teacherID 教師ID
	 * @param title 課題のタイトル
	 * @param description 課題の説明
	 * @param dueDate 締め切り日 (YYYY-MM-DD形式)
	 * @returns void
	 * @throws APIError, NetworkError, DataParseError
	 */
	async addNewHomework(classID: string, teacherID: string, title: string, description: string | null, dueDate: string | null): Promise<void> {
		const endPoint = LollipopHelper.instance.buildEndpoint("/homework/add_homework.php", {});

		const API_KEY = import.meta.env.VITE_TEACHER_APIKEY as string;
		const dueDateInISO = new Date(`${dueDate}T23:59:00Z`).toISOString();

		const body = JSON.stringify({
			teacher_id: teacherID,
			class_id: classID,
			title: title,
			description: description,
			due_date: dueDateInISO,
		});

		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endPoint, "HomeworkManager.addNewHomework", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: API_KEY,
			},
			body: body,
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, "HomeworkManager.addNewHomework");

		console.log("✅ Homework 保存成功。");
	}

	/**
	 * 指定した宿題の全生徒の提出状況を取得します。
	 * @param homeworkID 宿題ID
	 * @returns HomeworkWithSubmissionStatusの配列
	 * @throws APIError, NetworkError, DataParseError
	 */
	async fetchHomeworkWithSubmissionStatusForAllStudents(homeworkID: string): Promise<HomeworkWithSubmissionStatus[]> {
		const endPoint = LollipopHelper.instance.buildEndpoint("/homework/homework_status_list.php", { homework_id: homeworkID });
		const API_KEY = import.meta.env.VITE_API_KEY as string;

		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endPoint, "HomeworkManager.fetchHomeworkWithSubmissionStatusForAllStudents", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: API_KEY,
			},
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, "HomeworkManager.fetchHomeworkWithSubmissionStatusForAllStudents", true);

		const homeworkStatusList = LollipopHelper.instance.decodeDataFromLollipopResponse<RawHomeworkWithSubmissionStatusResponse[]>(
			lollipopResponse.data!,
			"HomeworkManager.fetchHomeworkWithSubmissionStatusForAllStudents"
		);

		return homeworkStatusList.map(transformHomeworkWithSubmissionStatusResponse);
	}
}
