import { useEffect, useState } from "react";
import type { HomeworkWithSubmissionStatus } from "../Entity/Homework.js";
import type { HomeworkManagerInterface } from "../ManagerInterface/HomeworkManagerInterface.js";
import { handleAppError } from "../Helper/handleAppError.js";
import type { QuestionWithChoicesManagerInterface } from "@/ManagerInterface/QuestionWithChoicesManagerInterface.js";
import { createQuestionAndChoicesAndUserSelectedChoice, type QuestionAndChoicesAndUserSelectedChoice } from "@/Entity/QuestionWithChoices.js";
import type { RemarkManagerInterface } from "@/ManagerInterface/RemarkManagerInterface.js";

export const useHomeworkStatusViewModel = (
	homeworkID: string,
	homeworkManager: HomeworkManagerInterface,
	questionWithChoicesManager: QuestionWithChoicesManagerInterface,
	remarkManager: RemarkManagerInterface
) => {
	const [loading, setLoading] = useState(true);
	const [homeworkStatusList, setHomeworkStatusList] = useState<HomeworkWithSubmissionStatus[]>([]);
	const [selectedSubmissionStatusIndex, setSelectedSubmissionStatusIndex] = useState<number | null>(null);
	const [questionAndChoicesAndUserSelectedChoice, setQuestionAndChoicesAndUserSelectedChoice] = useState<QuestionAndChoicesAndUserSelectedChoice[]>([]);

	// ---- 課題一覧の読み込み ----
	useEffect(() => {
		loadHomeworkStatus();
	}, [homeworkID]);

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

	// ---- 学生が選択されたら質問と選択肢を取得 ----
	useEffect(() => {
		setQuestionAndChoicesAndUserSelectedChoice([]);
		loadQuestionsAndChoices();
	}, [selectedSubmissionStatusIndex]);

	// ---- 学生選択 ----
	const onSelected = (newIndex: number) => {
		if (!selectedSubmissionStatusIndex) {
			setSelectedSubmissionStatusIndex(newIndex);
			return;
		}

		if (homeworkStatusList[selectedSubmissionStatusIndex]?.userStudentID === homeworkStatusList[newIndex]?.userStudentID) {
			setSelectedSubmissionStatusIndex(null);
		} else {
			setSelectedSubmissionStatusIndex(newIndex);
		}
	};

	const loadQuestionsAndChoices = async () => {
		if (selectedSubmissionStatusIndex === null) return;
		if (homeworkStatusList[selectedSubmissionStatusIndex]?.submissionState !== "completed") return;
		try {
			const qwc = await questionWithChoicesManager.fetch(homeworkID, homeworkStatusList[selectedSubmissionStatusIndex].userID);
			const userAnswers = await questionWithChoicesManager.fetchUserAnswers(homeworkID, homeworkStatusList[selectedSubmissionStatusIndex].userID);

			const result = qwc.map((q) => {
				const userAnswer = userAnswers.find((ans) => ans.questionID === q.questionID);

				return createQuestionAndChoicesAndUserSelectedChoice(q.questionID, q.questionText, q.choices, userAnswer?.selectedChoiceID ?? "");
			});

			setQuestionAndChoicesAndUserSelectedChoice(result);
		} catch (error) {
			alert(handleAppError(error));
		}
	};

	const handleCorrectChoiceChange = async (hw: HomeworkWithSubmissionStatus, questionID: string, newCorrectChoiceID: string) => {
		try {
			const questionToModify = questionAndChoicesAndUserSelectedChoice.find((q) => q.id === questionID);
			if (!questionToModify) throw new Error("質問が見つかりません。");

			const userChoiceID = questionToModify.userSelectedChoiceID;
			const userChoiceWasCorrect = userChoiceID === questionToModify.choices.find((c) => c.isCorrect)?.id;
			const newCorrectChoice = questionToModify.choices.find((c) => c.id === newCorrectChoiceID);
			if (!newCorrectChoice) throw new Error("新しい正解の選択肢が見つかりません。");
			const userChoiceIsNowCorrect = userChoiceID === newCorrectChoiceID;

			// 点数の計算
			let updatedScore = hw.score;
			if (userChoiceWasCorrect && !userChoiceIsNowCorrect) {
				// 正解→不正解に変わった場合、点数を減点
				updatedScore -= Math.floor(100 / questionAndChoicesAndUserSelectedChoice.length);
			} else if (!userChoiceWasCorrect && userChoiceIsNowCorrect) {
				// 不正解→正解に変わった場合、点数を加点
				updatedScore += Math.floor(100 / questionAndChoicesAndUserSelectedChoice.length);
			}
			const newScore = updatedScore;
			await remarkManager.remark(newScore, homeworkID, hw.userID, questionID, newCorrectChoiceID);
			await reload();
		} catch (error) {
			alert(handleAppError(error));
		}
	};

	const reload = async () => {
		await loadHomeworkStatus();
		await loadQuestionsAndChoices();
	};

	return {
		loading,
		homeworkStatusList,
		selectedSubmissionStatusIndex,
		questionAndChoicesAndUserSelectedChoice,
		onSelected,
		handleCorrectChoiceChange,
	};
};
