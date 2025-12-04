import { LucideArrowDown, LucideArrowUpDown, LucideArrowUp } from "lucide-react";

type SortField = "studentID" | "score" | "submissionDate";
type SortOrder = "asc" | "desc";

export type SortOption = {
	field: SortField;
	order: SortOrder;
};

const SORT_LABELS: Record<SortField, string> = {
	studentID: "学生ID",
	score: "スコア",
	submissionDate: "提出日",
};

const SORT_FIELDS: SortField[] = ["studentID", "score", "submissionDate"];

type SortButtonProps = {
	showSortMenu: boolean;
	setShowSortMenu: (show: boolean) => void;
	selectedSortOption: SortOption;
	onSortOptionChange: (option: SortOption) => void;
};

export const SortButton = ({ showSortMenu, setShowSortMenu, selectedSortOption, onSortOptionChange }: SortButtonProps) => {
	return (
		// ソートボタン本体
		<div
			className="card-hover relative inline-block text-white p-3.5 z-20"
			onClick={() => setShowSortMenu(!showSortMenu)}
			onMouseEnter={() => {
				setShowSortMenu(true);
			}}
			onMouseLeave={() => {
				setShowSortMenu(false);
			}}
		>
			<LucideArrowUpDown size={15} />

			{/* メニュー部分 */}
			{showSortMenu && (
				<div
					className="absolute right-0 top-full  w-48 card-secondary rounded-xl p-2 animate-fade-in"
					onClick={(e) => e.stopPropagation()} // <— added
				>
					{SORT_FIELDS.map((field) => (
						<MenuButton
							key={field}
							label={SORT_LABELS[field]}
							isSelected={selectedSortOption.field === field}
							onClick={() => {
								onSortOptionChange({ field, order: selectedSortOption.order === "asc" ? "desc" : "asc" });
							}}
							order={selectedSortOption.field === field ? selectedSortOption.order : null}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export const MenuButton = ({ label, isSelected, onClick, order }: { label: string; isSelected: boolean; onClick: () => void; order?: "asc" | "desc" | null }) => {
	const style = isSelected ? "font-extrabold text-primary bg-menu" : "";

	return (
		<button className={`m-1 w-full text-black text-left px-3 py-2 hover-bg-menu hover:text-primary cursor-pointer hover:font-extrabold rounded-lg transition ${style}`} onClick={onClick}>
			{label}

			{/*Sort Button の場合 (order が指定されている場合のみ表示)*/}
			{order !== undefined && <span className="float-right">{isSelected && (order === "asc" ? <LucideArrowDown size={20} /> : <LucideArrowUp size={20} />)}</span>}

			{/* Filter Button の場合 */}
			{order === undefined && isSelected && <span className="float-right text-primary">●</span>}
		</button>
	);
};
