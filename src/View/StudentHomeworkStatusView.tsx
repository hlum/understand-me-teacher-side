import { useParams } from "react-router-dom";
import { useHomeworkStatusViewModel } from "../ViewModel/HomeworkStatusViewModel.js";
import { Loading } from "./Components/Loading.js";
import { HomeworkManager } from "../Manager/HomeworkManager.js";
import { QuestionWithChoicesManager } from "@/Manager/QuestionWithChoicesManager.js";
import { QuestionAndChoicesCard } from "./Components/QuestionAndChoicesCard.js";
import { GeneralInformationOfSubmission } from "./Components/GeneralInformationOfSubmission.js";
import { HomeworkStatusItem } from "./Components/HomeworkStatusItem.js";
import { RemarkManager } from "@/Manager/RemarkManager.js";
import { SortButton } from "./Components/SortButton.js";
import { FilterButton } from "./Components/FilterButton.js";
import { DownloadCSVButton } from "./Components/DownloadCSVButton.js";

export const StudentHomeworkStatusView = () => {
	const { homeworkID } = useParams<{ homeworkID: string }>();

	if (!homeworkID) {
		return <div>Invalid homework ID</div>;
	}

	const homeworkManager = new HomeworkManager();
	const questionWithChoicesManager = new QuestionWithChoicesManager();
	const remarkManager = new RemarkManager();
	const {
		loading,
		filteredHomeworkStatusList,
		questionAndChoicesAndUserSelectedChoice,
		selectedSubmissionStatusIndex,
		onSelected,
		handleCorrectChoiceChange,
		handleFilterOrSortChange,
		currentShowingMenu,
		selectedFilters,
		selectedSortOption,
		setCurrentShowingMenu,
	} = useHomeworkStatusViewModel(homeworkID, homeworkManager, questionWithChoicesManager, remarkManager);

	const selectedStatus = selectedSubmissionStatusIndex !== null ? filteredHomeworkStatusList[selectedSubmissionStatusIndex] : null;

	if (loading) return <Loading />;

	return (
		<div className="page-bg min-h-screen p-8">
			<div className="max-w-7xl mx-auto">
				{/* ページタイトル */}
				<h1 className="heading-gradient mb-8 text-center">学生の進捗</h1>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* 左側：学生リスト */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h2 className="text-adaptive text-xl font-semibold mb-4">学生一覧</h2>

							{/* ソート・フィルターボタン群 */}
							<div className="flex gap-2">
								<DownloadCSVButton
									fileName={`${filteredHomeworkStatusList[0]?.title}_進捗.csv`}
									csvEntities={filteredHomeworkStatusList.map((hw) => ({
										studentID: hw.userStudentID,
										projectLink: hw.githubFileLink,
										homeworkTitle: hw.title,
										score: hw.score,
										submissionState: hw.submissionState,
										submittedAt: hw.submittedAt,
										homeworkDueDate: hw.dueDate,
									}))}
								/>
								<FilterButton
									selectedFilters={selectedFilters}
									setSelectedFilters={(filters) => {
										handleFilterOrSortChange(selectedSortOption, filters);
									}}
									showMenu={currentShowingMenu === "filter"}
									setShowMenu={(show) => {
										setCurrentShowingMenu(show ? "filter" : currentShowingMenu === "filter" ? null : currentShowingMenu);
									}}
								/>
								<SortButton
									selectedSortOption={selectedSortOption}
									showSortMenu={currentShowingMenu === "sort"}
									setShowSortMenu={(show) => {
										setCurrentShowingMenu(show ? "sort" : currentShowingMenu === "sort" ? null : currentShowingMenu);
									}}
									onSortOptionChange={(option) => handleFilterOrSortChange(option, selectedFilters)}
								/>
							</div>
						</div>
						{filteredHomeworkStatusList.map((hw, index) => (
							<HomeworkStatusItem
								homeworkWithSubmissionStatus={hw}
								isSelected={selectedSubmissionStatusIndex !== null && filteredHomeworkStatusList[selectedSubmissionStatusIndex]?.userStudentID === hw.userStudentID}
								onSelected={() => onSelected(index)}
								key={hw.userStudentID}
							/>
						))}
					</div>

					{/* 右側：詳細情報（スクロール可能） */}
					<div className="lg:sticky lg:top-8 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
						{selectedStatus ? (
							<div className="space-y-4">
								{/* 基本情報カード */}
								<GeneralInformationOfSubmission selectedSubmissionStatus={selectedStatus} />

								{/* 質問と回答カード群 */}
								<div className="space-y-6">
									<h2 className="text-xl font-semibold text-adaptive">質問と回答</h2>

									{questionAndChoicesAndUserSelectedChoice.map((qa, index) => (
										<QuestionAndChoicesCard
											questionAndChoicesAndUserSelectedChoice={qa}
											index={index}
											key={qa.id}
											newCorrectChoiceSelected={(choiceID) => {
												handleCorrectChoiceChange(selectedStatus, qa.id, choiceID);
											}}
										/>
									))}
								</div>
							</div>
						) : (
							<div className="card text-center">
								<p className="text-adaptive-secondary text-lg">学生を選択して詳細を表示</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
