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
	async fetchHomework(homeworkID: string): Promise<Homework> {
		const endPoint = LollipopHelper.instance.buildEndpoint("homework/get_homework.php", { id: homeworkID });
		const headers = LollipopHelper.instance.buildHeader();

		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse<RawHomeworkResponse[]>(endPoint, "HomeworkManager.fetchHomework", {
			method: "GET",
			headers: headers,
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, "HomeworkManager.fetchHomework");

		if (!lollipopResponse.data) {
			throw new Error("HomeworkManager.fetchHomework レスポンスの中にdataが存在しません。");
		}

		if (!Array.isArray(lollipopResponse.data)) {
			throw new Error("HomeworkManager.fetchHomework レスポンスデータの形式が不正です。配列ではありません。");
		}

		const homeworks = lollipopResponse.data.map(transformHomeworkResponse);

		if (homeworks.length === 0) {
			throw new Error("指定されたIDの宿題が見つかりません。");
		}

		if (!homeworks[0]) {
			throw new Error("宿題のデータが不正です。");
		}

		return homeworks[0];
	}

	async updateHomework(homeworkID: string, title?: string, description?: string | null, dueDate?: string | null): Promise<void> {
		const endPoint = LollipopHelper.instance.buildEndpoint("/homework/update_homework.php", {});
		const headers = LollipopHelper.instance.buildHeader(true);
		const body = JSON.stringify({
			homework_id: homeworkID,
			title: title,
			description: description,
			due_date: dueDate,
		});

		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endPoint, "HomeworkManager.updateHomework", {
			method: "UPDATE",
			headers: headers,
			body: body,
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, "HomeworkManager.updateHomework");

		console.log("✅ Homework 更新成功。");
	}

	async fetchHomeworkListForClass(classID: string): Promise<Homework[]> {
		const endPoint = LollipopHelper.instance.buildEndpoint("/homework/get_homework.php", { class_id: classID });
		const headers = LollipopHelper.instance.buildHeader();
		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse<RawHomeworkResponse[]>(endPoint, "HomeworkManager.fetchHomeworkListForClass", {
			method: "GET",
			headers: headers,
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, "HomeworkManager.fetchHomeworkListForClass");

		if (!lollipopResponse.data) {
			console.warn("HomeworkManager.fetchHomeworkListForClass レスポンスの中にdataが存在しません。");
			return [];
		}

		if (!Array.isArray(lollipopResponse.data)) {
			throw new Error("HomeworkManager.fetchHomeworkListForClass レスポンスデータの形式が不正です。配列ではありません。");
		}

		return lollipopResponse.data.map(transformHomeworkResponse);
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

		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse<RawHomeworkWithSubmissionStatusResponse[]>(
			endPoint,
			"HomeworkManager.fetchHomeworkWithSubmissionStatusForAllStudents",
			{
				method: "GET",
				headers: headers,
			}
		);

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, "HomeworkManager.fetchHomeworkWithSubmissionStatusForAllStudents");

		if (!lollipopResponse.data) {
			console.warn("HomeworkManager.fetchHomeworkWithSubmissionStatusForAllStudents レスポンスの中にdataが存在しません。");
			return [];
		}

		if (!Array.isArray(lollipopResponse.data)) {
			throw new Error("HomeworkManager.fetchHomeworkWithSubmissionStatusForAllStudents レスポンスデータの形式が不正です。配列ではありません。");
		}

		return lollipopResponse.data.map(transformHomeworkWithSubmissionStatusResponse);
	}

	async deleteHomework(homeworkID: string): Promise<void> {
		const endPoint = LollipopHelper.instance.buildEndpoint("/homework/delete_homework.php", { id: homeworkID });
		const headers = LollipopHelper.instance.buildHeader(true);

		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endPoint, "HomeworkManager.deleteHomework", {
			method: "DELETE",
			headers: headers,
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, "HomeworkManager.deleteHomework");

		console.log("✅ Homework 削除成功。");
	}

	async resubmitHomework(homeworkID: string, studentID: string): Promise<void> {
		const context = "HomeworkManager.resubmitHomework";
		const endPoint = LollipopHelper.instance.buildEndpoint("homework/delete_submitted_homework.php", { user_id: studentID, homework_id: homeworkID });
		const headers = LollipopHelper.instance.buildHeader(false);

		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endPoint, context, {
			method: "DELETE",
			headers: headers,
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, context);
		console.log("✅ Homework resubmit success.");
	}
}
