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
	async fetchHomeworkListForClass(classID: string): Promise<Homework[]> {
		const endPoint = LollipopHelper.instance.buildEndpoint("/homework/get_homework.php", { class_id: classID });
		const headers = LollipopHelper.instance.buildHeader();
		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endPoint, "HomeworkManager.fetchHomeworkListForClass", {
			method: "GET",
			headers: headers,
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, "HomeworkManager.fetchHomeworkListForClass", true);
		const homeworks = LollipopHelper.instance.decodeDataFromLollipopResponse<RawHomeworkResponse[]>(lollipopResponse.data!, "HomeworkManager.fetchHomeworkListForClass");

		return homeworks.map(transformHomeworkResponse);
	}

	async addNewHomework(classID: string, teacherID: string, title: string, description: string | null, dueDate: string | null): Promise<void> {
		const endPoint = LollipopHelper.instance.buildEndpoint("/homework/add_homework.php", {});
		const headers = LollipopHelper.instance.buildHeader(true);
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
			headers: headers,
			body: body,
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, "HomeworkManager.addNewHomework");

		console.log("✅ Homework 保存成功。");
	}

	async fetchHomeworkWithSubmissionStatusForAllStudents(homeworkID: string): Promise<HomeworkWithSubmissionStatus[]> {
		const endPoint = LollipopHelper.instance.buildEndpoint("/homework/homework_status_list.php", { homework_id: homeworkID });
		const headers = LollipopHelper.instance.buildHeader();

		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endPoint, "HomeworkManager.fetchHomeworkWithSubmissionStatusForAllStudents", {
			method: "GET",
			headers: headers,
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, "HomeworkManager.fetchHomeworkWithSubmissionStatusForAllStudents", true);

		const homeworkStatusList = LollipopHelper.instance.decodeDataFromLollipopResponse<RawHomeworkWithSubmissionStatusResponse[]>(
			lollipopResponse.data!,
			"HomeworkManager.fetchHomeworkWithSubmissionStatusForAllStudents"
		);

		return homeworkStatusList.map(transformHomeworkWithSubmissionStatusResponse);
	}
}
