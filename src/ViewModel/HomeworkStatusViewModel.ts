import { useEffect, useState } from "react";
import type { HomeworkWithSubmissionStatus, SubmissionState } from "../Entity/Homework.js";
import type { HomeworkManagerInterface } from "../ManagerInterface/HomeworkManagerInterface.js";
import { handleAppError } from "../Helper/handleAppError.js";
import type { QuestionWithChoicesManagerInterface } from "@/ManagerInterface/QuestionWithChoicesManagerInterface.js";
import { createQuestionAndChoicesAndUserSelectedChoice, type QuestionAndChoicesAndUserSelectedChoice } from "@/Entity/QuestionWithChoices.js";
import type { RemarkManagerInterface } from "@/ManagerInterface/RemarkManagerInterface.js";
import type { SortOption } from "@/View/Components/SortButton.js";

export const useHomeworkStatusViewModel = (
	homeworkID: string,
	homeworkManager: HomeworkManagerInterface,
	questionWithChoicesManager: QuestionWithChoicesManagerInterface,
	remarkManager: RemarkManagerInterface
) => {
	const [loading, setLoading] = useState(true);
	const [homeworkStatusList, setHomeworkStatusList] = useState<HomeworkWithSubmissionStatus[]>([]);
	const [filteredHomeworkStatusList, setFilteredHomeworkStatusList] = useState<HomeworkWithSubmissionStatus[]>([]);
	const [selectedSubmissionStatusIndex, setSelectedSubmissionStatusIndex] = useState<number | null>(null);
	const [questionAndChoicesAndUserSelectedChoice, setQuestionAndChoicesAndUserSelectedChoice] = useState<QuestionAndChoicesAndUserSelectedChoice[]>([]);

	// Filter と Sortの状態
	const [currentShowingMenu, setCurrentShowingMenu] = useState<"filter" | "sort" | null>(null); // ソートとフィルターメニューが同時に開かれないようにするための状態
	const [selectedFilters, setSelectedFilters] = useState<SubmissionState[]>([]);
	const [selectedSortOption, setSelectedSortOption] = useState<SortOption>({ field: "studentID", order: "asc" });

	// ---- 課題一覧の読み込み ----
	useEffect(() => {
		loadHomeworkStatus();
	}, [homeworkID]);

	const loadHomeworkStatus = async () => {
		try {
			setLoading(true);
			const statusList = await homeworkManager.fetchHomeworkWithSubmissionStatusForAllStudents(homeworkID);
			statusList.sort((a, b) => a.userStudentID.localeCompare(b.userStudentID));
			setHomeworkStatusList(statusList);
			setFilteredHomeworkStatusList(statusList);
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

				return createQuestionAndChoicesAndUserSelectedChoice(q.questionID, q.questionText, q.choices, userAnswer?.selectedChoiceID ?? null);
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

	const handleSortOptionChange = (option: SortOption) => {
		setSelectedSortOption(option);
		const sortedList = [...filteredHomeworkStatusList].sort((a, b) => {
			switch (option.field) {
				case "studentID":
					return option.order === "asc" ? a.userStudentID.localeCompare(b.userStudentID) : b.userStudentID.localeCompare(a.userStudentID);

				case "score":
					return option.order === "asc" ? a.score - b.score : b.score - a.score;

				case "submissionDate":
					const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
					const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;

					return option.order === "asc" ? dateA - dateB : dateB - dateA;
			}
		});

		setFilteredHomeworkStatusList(sortedList);
	};

	const handleFilterOptionChange = (options: SubmissionState[]) => {
		setSelectedFilters(options);
		const filteredList = [...homeworkStatusList].filter((hw) => {
			if (options.length === 0) return true; // フィルターが空の場合、すべて表示
			return options.includes(hw.submissionState);
		});

		setFilteredHomeworkStatusList(filteredList);
	};

	const handleFilterOrSortChange = (sortOption: SortOption, filterOptions: SubmissionState[]) => {
		if (sortOption === selectedSortOption) {
			// フィルターのみ変わった場合
			handleFilterOptionChange(filterOptions);
		} else if (filterOptions === selectedFilters) {
			// ソートのみ変わった場合
			handleSortOptionChange(sortOption);
		} else {
			// 両方変わった場合は、先にフィルターをかけてからソートをかける
			handleFilterOptionChange(filterOptions);
			handleSortOptionChange(sortOption);
		}
	};

	const handleResetSubmission = async (hw: HomeworkWithSubmissionStatus) => {
		try {
			await homeworkManager.resetSubmission(hw.id, hw.userID);
			await reload();
		} catch (error) {
			alert(handleAppError(error));
		}
	};

	return {
		loading,
		selectedSubmissionStatusIndex,
		questionAndChoicesAndUserSelectedChoice,
		onSelected,
		handleCorrectChoiceChange,
		handleFilterOrSortChange,
		selectedFilters,
		selectedSortOption,
		currentShowingMenu,
		handleResetSubmission,
		setCurrentShowingMenu,
		filteredHomeworkStatusList,
	};
};
