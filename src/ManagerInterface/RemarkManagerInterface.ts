export interface RemarkManagerInterface {
	/**
	 * 正解の選択肢を変更し、点数を再計算します。
	 * @param newScore 新しい点数
	 * @param homeworkID 宿題ID
	 * @param studentID 学生ID
	 * @param questionID 質問ID
	 * @param newCorrectChoiceID 新しい正解の選択肢ID
	 * @returns void
	 * @throws APIError, NetworkError, DataParseError
	 */
	remark(newScore: number, homeworkID: string, studentID: string, questionID: string, newCorrectChoiceID: string): Promise<void>;
}
