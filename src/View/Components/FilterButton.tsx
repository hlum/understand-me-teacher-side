import { submissionStateLabel, type SubmissionState } from "@/Entity/Homework.js";
import { LucideListFilter } from "lucide-react";
import { MenuButton } from "./SortButton.js";

// mapで回す用
const FILTER_OPTIONS: SubmissionState[] = ["notAssigned", "completed", "generatingQuestions", "questionGenerated"];

type FilterButtonProps = {
	showMenu: boolean;
	setShowMenu: (show: boolean) => void;
	selectedFilters: SubmissionState[];
	setSelectedFilters: (filters: SubmissionState[]) => void;
};

export const FilterButton = ({ showMenu, setShowMenu, selectedFilters, setSelectedFilters }: FilterButtonProps) => {
	return (
		<div
			className="card-hover relative inline-block text-white p-3.5 z-20"
			onMouseEnter={() => {
				setShowMenu(true);
			}}
			onMouseLeave={() => {
				setShowMenu(false);
			}}
		>
			<LucideListFilter size={15} />

			{/* メニュー部分 */}
			{showMenu && (
				<div className="absolute right-0 top-full w-48 card-secondary rounded-xl p-2 animate-fade-in">
					{FILTER_OPTIONS.map((option) => (
						<MenuButton
							key={option}
							label={submissionStateLabel(option)}
							isSelected={selectedFilters.includes(option)}
							onClick={() => {
								if (selectedFilters.includes(option)) {
									// すでに選択されている場合は外す
									setSelectedFilters(selectedFilters.filter((f) => f !== option));
									return;
								}
								// 選択されていない場合は追加
								setSelectedFilters([...selectedFilters, option]);
							}}
						/>
					))}
				</div>
			)}
		</div>
	);
};
