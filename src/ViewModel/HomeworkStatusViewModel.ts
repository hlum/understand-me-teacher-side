import { useEffect, useState } from "react";
import type { HomeworkWithSubmissionStatus } from "../Entity/Homework.js";
import type { HomeworkManagerInterface } from "../ManagerInterface/HomeworkManagerInterface.js";
import { handleAppError } from "../Helper/handleAppError.js";

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
				alert(handleAppError(error));
			} finally {
				setLoading(false);
			}
		};
		loadHomeworkStatus();
	}, [homeworkID]);

	return { loading, homeworkStatusList };
};
