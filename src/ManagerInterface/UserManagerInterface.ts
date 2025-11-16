export interface UserManagerInterface {
	/**
	 * ユーザー情報を保存します。
	 * @param id Firebase Auth UUID
	 * @param email ユーザーのメールアドレス
	 * @param name ユーザーの名前
	 * @param photoURL ユーザーの写真URL
	 * @returns void
	 * @throws APIError, NetworkError, DataParseError
	 */
	registerTeacher(id: string, email: string, name: string, photoURL: string): Promise<void>;

	/**
	 * ユーザー(teacher)がデータベースに既に存在するかどうかを確認します。
	 * @param userID Firebase Auth UUID
	 * @returns 存在する場合はtrue、存在しない場合はfalse
	 * @throws APIError, NetworkError, DataParseError
	 */
	teacherRecordExists(userID: string): Promise<boolean>;
}
