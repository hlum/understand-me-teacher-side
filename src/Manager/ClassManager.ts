import { type Class, type RawClassResponse, transformClassResponse } from "../Entity/Class.js";
import { DataParseError } from "../Helper/CustomErrors.js";
import { LollipopHelper } from "../Helper/LollipopHelper.js";
import { type ClassManagerInterface } from "../ManagerInterface/ClassManagerInterface.js";

export class ClassManager implements ClassManagerInterface {
	async fetchClass(classID: string): Promise<Class> {
		const context = "ClassManager.fetchClass"; // エラーログ用のコンテキスト情報

		const endPoint = LollipopHelper.instance.buildEndpoint("/class/get_class.php", { id: classID });
		const headers = LollipopHelper.instance.buildHeader();
		const result = await LollipopHelper.instance.fetchAndDecodeLollipopResponse<RawClassResponse[]>(endPoint, context, {
			method: "GET",
			headers: headers,
		});

		LollipopHelper.instance.validateLollipopResponse(result, context);

		if (!result.data) {
			throw new DataParseError("ClassManager.fetchClass レスポンスの中にdataが存在しません。");
		}

		if (!Array.isArray(result.data)) {
			throw new DataParseError("ClassManager.fetchClass レスポンスデータの形式が不正です。配列ではありません。");
		}

		const classDetails = result.data.map(transformClassResponse)[0];

		if (!classDetails) {
			throw new DataParseError("ClassManager.fetchClass 生のデータからクラス詳細を取得できませんでした。");
		}
		return classDetails;
	}

	async fetchClassesForTeacher(teacherID: string): Promise<Class[]> {
		const endPoint = LollipopHelper.instance.buildEndpoint("class/get_class.php", { teacher_id: teacherID });
		const headers = LollipopHelper.instance.buildHeader();

		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse<RawClassResponse[]>(endPoint, "ClassManager.fetchClassesForTeacher", {
			method: "GET",
			headers: headers,
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, "ClassManager.fetchClassesForTeacher");

		if (!lollipopResponse.data) {
			console.warn("ClassManager.fetchClassesForTeacher レスポンスの中にdataが存在しません。");
			return [];
		}

		if (!Array.isArray(lollipopResponse.data)) {
			throw new DataParseError("ClassManager.fetchClassesForTeacher レスポンスデータの形式が不正です。配列ではありません。");
		}

		return lollipopResponse.data.map(transformClassResponse);
	}

	async addNewClass(newClass: Class): Promise<void> {
		const endPoint = LollipopHelper.instance.buildEndpoint("/class/add_class.php", {});
		const headers = LollipopHelper.instance.buildHeader(true);

		let body: string;
		try {
			body = JSON.stringify({
				teacher_id: newClass.teacherID,
				name: newClass.name,
				admission_year: newClass.admissionYear,
				major_code: newClass.majorCode,
				class_code: newClass.classCode ?? null,
			});
		} catch (error) {
			throw new DataParseError("ClassManager.addNewClass クラス情報のシリアライズに失敗しました。エラー: " + error);
		}

		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endPoint, "ClassManager.addNewClass", {
			method: "POST",
			headers: headers,
			body,
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, "ClassManager.addNewClass");

		console.info("✅ クラス追加成功。");
	}

	async updateClass(newClass: Class): Promise<void> {
		const endPoint = LollipopHelper.instance.buildEndpoint("/class/update_class.php", {});
		const headers = LollipopHelper.instance.buildHeader(true);

		let body: string;
		try {
			body = JSON.stringify({
				id: newClass.id,
				teacher_id: newClass.teacherID,
				name: newClass.name,
				admission_year: newClass.admissionYear,
				major_code: newClass.majorCode,
				class_code: newClass.classCode ?? null,
			});

			const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endPoint, "ClassManager.updateClass", {
				method: "UPDATE",
				headers: headers,
				body,
			});

			LollipopHelper.instance.validateLollipopResponse(lollipopResponse, "ClassManager.updateClass");

			console.info("✅ クラス更新成功。");
		} catch (error) {
			throw new DataParseError("ClassManager.updateClass クラス情報のシリアライズに失敗しました。エラー: " + error);
		}
	}
}
