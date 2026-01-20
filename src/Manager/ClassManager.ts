import { type Class, type RawClassResponse, transformClassResponse } from "../Entity/Class.js";
import { DataParseError } from "../Helper/CustomErrors.js";
import { LollipopHelper } from "../Helper/LollipopHelper.js";
import { type ClassManagerInterface } from "../ManagerInterface/ClassManagerInterface.js";

export class ClassManager implements ClassManagerInterface {
	async fetchClass(classID: string): Promise<Class> {
		const context = "ClassManager.fetchClass";
		const endpoint = LollipopHelper.instance.buildEndpoint("/class/get_class.php", { id: classID });
		const headers = await LollipopHelper.instance.buildHeaders();

		const response = await LollipopHelper.instance.fetchAndDecodeLollipopResponse<RawClassResponse[]>(endpoint, context, {
			method: "GET",
			headers: headers,
		});

		LollipopHelper.instance.validateLollipopResponse(response, context);

		if (!response.data) {
			throw new DataParseError(`${context}: レスポンスの中にdataが存在しません。`);
		}

		if (!Array.isArray(response.data)) {
			throw new DataParseError(`${context}: レスポンスデータの形式が不正です。配列ではありません。`);
		}

		const classData = response.data.map(transformClassResponse)[0];

		if (!classData) {
			throw new DataParseError(`${context}: クラスデータを取得できませんでした。`);
		}

		return classData;
	}

	async fetchClassesForTeacher(teacherID: string): Promise<Class[]> {
		const context = "ClassManager.fetchClassesForTeacher";
		const endpoint = LollipopHelper.instance.buildEndpoint("class/get_class.php", { teacher_id: teacherID });
		const headers = await LollipopHelper.instance.buildHeaders();

		const response = await LollipopHelper.instance.fetchAndDecodeLollipopResponse<RawClassResponse[]>(endpoint, context, {
			method: "GET",
			headers: headers,
		});

		LollipopHelper.instance.validateLollipopResponse(response, context);

		if (!response.data) {
			return [];
		}

		if (!Array.isArray(response.data)) {
			throw new DataParseError(`${context}: レスポンスデータの形式が不正です。配列ではありません。`);
		}

		return response.data.map(transformClassResponse);
	}

	async addClass(newClass: Class): Promise<void> {
		const context = "ClassManager.addClass";
		const endpoint = LollipopHelper.instance.buildEndpoint("/class/add_class.php", {});
		const headers = await LollipopHelper.instance.buildHeaders(true);

		const body = JSON.stringify({
			teacher_id: newClass.teacherID,
			name: newClass.name,
			admission_year: newClass.admissionYear,
			major_code: newClass.majorCode,
			class_code: newClass.classCode ?? null,
		});

		const response = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endpoint, context, {
			method: "POST",
			headers: headers,
			body,
		});

		LollipopHelper.instance.validateLollipopResponse(response, context);
	}

	async updateClass(classData: Class): Promise<void> {
		const context = "ClassManager.updateClass";
		const endpoint = LollipopHelper.instance.buildEndpoint("/class/update_class.php", {});
		const headers = await LollipopHelper.instance.buildHeaders(true);

		const body = JSON.stringify({
			id: classData.id,
			teacher_id: classData.teacherID,
			name: classData.name,
			admission_year: classData.admissionYear,
			major_code: classData.majorCode,
			class_code: classData.classCode ?? null,
		});

		const response = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endpoint, context, {
			method: "UPDATE",
			headers: headers,
			body,
		});

		LollipopHelper.instance.validateLollipopResponse(response, context);
	}
}
