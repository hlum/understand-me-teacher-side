import { type Class, type RawClassResponse, transformClassResponse } from "../Entity/Class.js";
import { DataParseError } from "../Helper/CustomErrors.js";
import { LollipopHelper } from "../Helper/LollipopHelper.js";
import { type ClassManagerInterface } from "../ManagerInterface/ClassManagerInterface.js";

export class ClassManager implements ClassManagerInterface {
	/**
	 * 指定したクラスIDのクラス情報を取得します。
	 * @param classID クラスID
	 * @returns Classオブジェクト
	 * @throws APIError, NetworkError, DataParseError
	 */
	async fetchClass(classID: string): Promise<Class> {
		const context = "ClassManager.fetchClass"; // エラーログ用のコンテキスト情報

		const endPoint = LollipopHelper.instance.buildEndpoint("/class/get_class.php", { id: classID });
		const API_KEY = import.meta.env.VITE_API_KEY as string;

		const result = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endPoint, context, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: API_KEY,
			},
		});

		LollipopHelper.instance.validateLollipopResponse(result, context, true);
		const rawClassResponse = LollipopHelper.instance.decodeDataFromLollipopResponse<RawClassResponse[]>(result.data!, context);

		if (!Array.isArray(rawClassResponse)) {
			throw new DataParseError("ClassManager.fetchClass レスポンスデータの形式が不正です。配列ではありません。");
		}

		const classDetails = rawClassResponse.map(transformClassResponse)[0];

		if (!classDetails) {
			throw new DataParseError("ClassManager.fetchClass 生のデータからクラス詳細を取得できませんでした。");
		}
		return classDetails;
	}

	/**
	 * 指定した教師IDに関連するクラスのリストを取得します。
	 * @param teacherID 教師ID
	 * @returns Classオブジェクトの配列
	 * @throws APIError, NetworkError, DataParseError
	 */
	async fetchClassesForTeacher(teacherID: string): Promise<Class[]> {
		const endPoint = LollipopHelper.instance.buildEndpoint("class/get_class.php", { teacher_id: teacherID });
		const API_KEY = import.meta.env.VITE_API_KEY as string;
		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endPoint, "ClassManager.fetchClassesForTeacher", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: API_KEY,
			},
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, "ClassManager.fetchClassesForTeacher");

		if (!lollipopResponse.data) {
			console.warn("ClassManager.fetchClassesForTeacher レスポンスの中にdataが存在しません。");
			return [];
		}

		const rawClassList = LollipopHelper.instance.decodeDataFromLollipopResponse<RawClassResponse[]>(lollipopResponse.data, "ClassManager.fetchClassesForTeacher");

		if (!Array.isArray(rawClassList)) {
			throw new DataParseError("ClassManager.fetchClassesForTeacher レスポンスデータの形式が不正です。配列ではありません。");
		}

		return rawClassList.map(transformClassResponse);
	}

	/**
	 * 新しいクラスを追加します。
	 * @param newClass 追加するクラスの情報
	 * @returns void
	 * @throws APIError, NetworkError, DataParseError
	 */
	async addNewClass(newClass: Class): Promise<void> {
		const endPoint = LollipopHelper.instance.buildEndpoint("/class/add_class.php", {});
		const API_KEY = import.meta.env.VITE_TEACHER_APIKEY as string;

		let body: string;
		try {
			body = JSON.stringify({
				teacher_id: newClass.teacherID,
				name: newClass.name,
				admission_year: newClass.admissionYear,
				major_code: newClass.majorCode,
			});
		} catch (error) {
			throw new DataParseError("ClassManager.addNewClass クラス情報のシリアライズに失敗しました。エラー: " + error);
		}

		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endPoint, "ClassManager.addNewClass", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: API_KEY,
			},
			body,
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, "ClassManager.addNewClass");

		console.info("✅ クラス追加成功。");
	}
}
