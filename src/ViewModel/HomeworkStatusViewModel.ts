import { useEffect, useState } from "react";
import type { HomeworkWithSubmissionStatus } from "../Entity/Homework.js";
import type { HomeworkManagerInterface } from "../ManagerInterface/HomeworkManagerInterface.js";
import { handleAppError } from "../Helper/handleAppError.js";
import type { QuestionWithChoicesManagerInterface } from "@/ManagerInterface/QuestionWithChoicesManagerInterface.js";
import { createQuestionAndChoicesAndUserSelectedChoice, type QuestionAndChoicesAndUserSelectedChoice } from "@/Entity/QuestionWithChoices.js";

export const useHomeworkStatusViewModel = (homeworkID: string, homeworkManager: HomeworkManagerInterface, questionWithChoicesManager: QuestionWithChoicesManagerInterface) => {
	const [loading, setLoading] = useState(true);
	const [homeworkStatusList, setHomeworkStatusList] = useState<HomeworkWithSubmissionStatus[]>([]);
	const [selectedSubmissionStatus, setSelectedSubmissionStatus] = useState<HomeworkWithSubmissionStatus | null>(null);
	const [questionAndChoicesAndUserSelectedChoice, setQuestionAndChoicesAndUserSelectedChoice] = useState<QuestionAndChoicesAndUserSelectedChoice[]>([]);

	// ---- 課題一覧の読み込み ----
	useEffect(() => {
		const loadHomeworkStatus = async () => {
			try {
				setLoading(true);
				const statusList = await homeworkManager.fetchHomeworkWithSubmissionStatusForAllStudents(homeworkID);
				setHomeworkStatusList(statusList);
			} catch (error) {
				alert(handleAppError(error));
			} finally {
				setLoading(false);
			}
		};

		loadHomeworkStatus();
	}, [homeworkID]);

	// ---- 学生が選択されたら質問と選択肢を取得 ----
	useEffect(() => {
		setQuestionAndChoicesAndUserSelectedChoice([]);

		if (!selectedSubmissionStatus) return;
		if (selectedSubmissionStatus.submissionState !== "completed") return;

		const load = async () => {
			try {
				const qwc = await questionWithChoicesManager.fetch(homeworkID, selectedSubmissionStatus.userID);
				const userAnswers = await questionWithChoicesManager.fetchUserAnswers(homeworkID, selectedSubmissionStatus.userID);

				const result = qwc.map((q) => {
					const userAnswer = userAnswers.find((ans) => ans.questionID === q.questionID);

					return createQuestionAndChoicesAndUserSelectedChoice(q.questionID, q.questionText, q.choices, userAnswer?.selectedChoiceID ?? "");
				});

				setQuestionAndChoicesAndUserSelectedChoice(result);
			} catch (error) {
				alert(handleAppError(error));
			}
		};

		load();
	}, [selectedSubmissionStatus]);

	// ---- 学生選択 ----
	const onSelected = (hw: HomeworkWithSubmissionStatus) => {
		if (selectedSubmissionStatus?.userStudentID === hw.userStudentID) {
			setSelectedSubmissionStatus(null);
		} else {
			setSelectedSubmissionStatus(hw);
		}
	};

	return {
		loading,
		homeworkStatusList,
		selectedSubmissionStatus,
		questionAndChoicesAndUserSelectedChoice,
		onSelected,
	};
};
