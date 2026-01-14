import type { Class } from "../Entity/Class.js";

export interface ClassManagerInterface {
	/**
	 * 新しいクラスを追加します。
	 * @param newClass 追加するクラスの情報
	 * @returns void
	 * @throws APIError, NetworkError, DataParseError
	 */
	addNewClass(newClass: Class): Promise<void>;

	/**
	 * 指定したクラスIDのクラス情報を取得します。
	 * @param classID クラスID
	 * @returns Classオブジェクト
	 * @throws APIError, NetworkError, DataParseError
	 */
	fetchClass(classID: string): Promise<Class>;

	/**
	 * 指定した教師IDに関連するクラスのリストを取得します。
	 * @param teacherID 教師ID
	 * @returns Classオブジェクトの配列
	 * @throws APIError, NetworkError, DataParseError
	 */
	fetchClassesForTeacher(teacherID: string): Promise<Class[]>;

	/**
	 * クラス情報を更新します。
	 * @param newClass 更新するクラスの情報
	 * @returns void
	 * @throws APIError, NetworkError, DataParseError
	 */
	updateClass(newClass: Class): Promise<void>;
}
