import { type Homework, type HomeworkWithSubmissionStatus } from "../Entity/Homework.js";

export interface HomeworkManagerInterface {
	/**
	 * 科目の課題リストを取得します。
	 * @param classID 科目ID
	 * @returns 課題の配列
	 * @throws APIError, NetworkError, DataParseError
	 */
	fetchHomeworkListForClass(classID: string): Promise<Homework[]>;

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
	addNewHomework(classID: string, teacherID: string, title: string, description: string | null, dueDate: string | null): Promise<void>;

	/**
	 * 指定した宿題の全生徒の提出状況を取得します。
	 * @param homeworkID 宿題ID
	 * @returns HomeworkWithSubmissionStatusの配列
	 * @throws APIError, NetworkError, DataParseError
	 */
	fetchHomeworkWithSubmissionStatusForAllStudents(homeworkID: string): Promise<HomeworkWithSubmissionStatus[]>;

	/**
	 * 指定した宿題の情報を取得します。
	 * @param homeworkID 宿題ID
	 * @returns Homework
	 * @throws APIError, NetworkError, DataParseError
	 */
	fetchHomework(id: string): Promise<Homework>;

	/**
	 * 指定した宿題の情報を更新します。
	 * 必要なフィールドだけ更新可能です。
	 * @param homeworkID 宿題ID
	 * @param title タイトル
	 * @param description 説明
	 * @param dueDate 締め切り日 (YYYY-MM-DD形式)
	 * @returns void
	 * @throws APIError, NetworkError
	 */
	updateHomework(homeworkID: string, title?: string, description?: string | null, dueDate?: string | null): Promise<void>;

	/**
	 * 指定した宿題を削除します。
	 * @param homeworkID 宿題ID
	 * @returns void
	 * @throws APIError, NetworkError
	 */
	deleteHomework(homeworkID: string): Promise<void>;

	/**
	 * 再提出させるため、projeectを削除する
	 * @param homeworkID 宿題ID
	 * @param studentID 生徒ID
	 * @returns void
	 * @throws APIError, NetworkError
	 * @throws DataParseError
	 */
	resubmitHomework(homeworkID: string, studentID: string): Promise<void>;
}
