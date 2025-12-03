import { LucideArrowDown, LucideArrowUpDown, LucideArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

type SortField = "studentID" | "score" | "submissionDate";
type SortOrder = "asc" | "desc";

export type SortOption = {
	field: SortField;
	order: SortOrder;
};

type SortButtonProps = {
	onSortChange: (option: SortOption) => void;
};

export const SortButton = ({ onSortChange }: SortButtonProps) => {
	const [sortOption, setSortOption] = useState<SortOption>({
		field: "studentID",
		order: "asc",
	});

	const [showMenu, setShowMenu] = useState(false);
	const SORT_FIELDS: SortField[] = ["studentID", "score", "submissionDate"];

	const SORT_LABELS: Record<SortField, string> = {
		studentID: "学生ID",
		score: "スコア",
		submissionDate: "提出日",
	};

	useEffect(() => {
		onSortChange(sortOption);
	}, [sortOption]);

	return (
		// ソートボタン本体
		<div className="card-hover relative inline-block text-white p-3.5 z-20" onClick={() => setShowMenu(!showMenu)}>
			<LucideArrowUpDown size={15} />

			{/* メニュー部分 */}
			{showMenu && (
				<div
					className="absolute right-0 top-full mt-2 w-48 card-secondary rounded-xl p-2 animate-fade-in mr-4"
					onClick={(e) => e.stopPropagation()} // <— added
				>
					{SORT_FIELDS.map((field) => (
						<MenuButton
							key={field}
							label={SORT_LABELS[field]}
							isSelected={sortOption.field === field}
							onClick={() => {
								setSortOption((prev) => ({
									field,
									order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
								}));
							}}
							order={sortOption.field === field ? sortOption.order : null}
						/>
					))}
				</div>
			)}
		</div>
	);
};

const MenuButton = ({ label, isSelected, onClick, order }: { label: string; isSelected: boolean; onClick: () => void; order: "asc" | "desc" | null }) => {
	const style = isSelected ? "font-extrabold text-primary bg-menu" : "";

	return (
		<button className={`m-1 w-full text-black text-left px-3 py-2 hover-bg-menu hover:text-primary cursor-pointer hover:font-extrabold rounded-lg transition ${style}`} onClick={onClick}>
			{label}

			<span className="float-right">{isSelected && (order === "asc" ? <LucideArrowDown size={20} /> : <LucideArrowUp size={20} />)}</span>
		</button>
	);
};
