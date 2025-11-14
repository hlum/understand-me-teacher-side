import { useEffect, useState } from "react";
import type { HomeworkWithSubmissionStatus } from "../Entity/Homework.js";
import type { HomeworkManagerInterface } from "../ManagerInterface/HomeworkManagerInterface.js";
import { DataParseError, NetworkError, APIError } from "../Helper/CustomErrors.js";

export const useHomeworkStatusViewModel = (homeworkID: string, homeworkManager: HomeworkManagerInterface) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [homeworkStatusList, setHomeworkStatusList] = useState<HomeworkWithSubmissionStatus[]>([]);

	useEffect(() => {
		const loadHomeworkStatus = async () => {
			try {
				setLoading(true);
				const statusList = await homeworkManager.fetchHomeworkWithSubmissionStatusForAllStudents(homeworkID);
				setHomeworkStatusList(statusList);
			} catch (error: unknown) {
				if (error instanceof APIError) {
					alert("API側でエラーが発生しました。もう一度お試しください。");
					console.error("APIError: ", error);
				} else if (error instanceof NetworkError) {
					alert("ネットワークエラーが発生しました。接続を確認して、もう一度お試しください。");
					console.error("NetworkError: ", error);
				} else if (error instanceof DataParseError) {
					alert("データのデコード中にエラーが発生しました。");
					console.error("DataParseError: ", error);
				} else {
					alert("クラスの詳細を取得中にエラーが発生しました。");
					console.error("Error: ", error);
				}
			} finally {
				setLoading(false);
			}
		};
		loadHomeworkStatus();
	}, [homeworkID]);

	return { loading, homeworkStatusList };
};
