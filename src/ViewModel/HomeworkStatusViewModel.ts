import { useEffect, useState } from "react";
import type { HomeworkWithSubmissionStatus } from "../Entity/Homework.js";
import type { HomeworkManagerInterface } from "../ManagerInterface/HomeworkManagerInterface.js";
import { handleAppError } from "../Helper/handleAppError.js";
import type { QuestionWithChoicesManagerInterface } from "@/ManagerInterface/QuestionWithChoicesManagerInterface.js";
import { auth } from "@/firebase/firebase.js";
import { type QuestionWithChoices } from "@/Entity/QuestionWithChoices.js";

export const useHomeworkStatusViewModel = (homeworkID: string, homeworkManager: HomeworkManagerInterface, questionWithChoicesManager: QuestionWithChoicesManagerInterface) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [homeworkStatusList, setHomeworkStatusList] = useState<HomeworkWithSubmissionStatus[]>([]);
	const [questionWithChoices, setQuestionWithChoices] = useState<QuestionWithChoices[]>([]);
	const [selectedSubmissionStatus, setSelectedSubmissionStatus] = useState<HomeworkWithSubmissionStatus | null>(null);

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

	useEffect(() => {
		if (!selectedSubmissionStatus) return;
		loadQuestionWithChoicesForSelectedStudent();
	}, [selectedSubmissionStatus]);

	const loadQuestionWithChoicesForSelectedStudent = async () => {
		try {
			if (selectedSubmissionStatus === null) {
				return;
			}

			if (selectedSubmissionStatus.submissionState !== "completed") {
				console.info("まだ提出終了ではないので、詳細の取得をスキップする");
				return;
			}

			const questionWithChoices = await questionWithChoicesManager.fetch(homeworkID, selectedSubmissionStatus.userID);
			console.log(questionWithChoices);
			setQuestionWithChoices(questionWithChoices);
		} catch (error) {
			alert(handleAppError(error));
		}
	};

	// 学生一人を選択した場合の処理
	const onSelected = async (hw: HomeworkWithSubmissionStatus) => {
		if (selectedSubmissionStatus?.userStudentID === hw.userStudentID) {
			setSelectedSubmissionStatus(null);
		} else {
			setSelectedSubmissionStatus(hw);
		}
	};

	return { loading, homeworkStatusList, questionWithChoices, selectedSubmissionStatus, onSelected };
};
