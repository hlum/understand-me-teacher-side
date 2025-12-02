import { useState } from "react";
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { handleAppError } from "@/Helper/handleAppError.js";
import { HomeworkManager } from "@/Manager/HomeworkManager.js";
import { useRouteManager } from "@/Router/useRouteManager.js";

export const HomeworkCard = (item: { id: string; title: string; description: string | null; dueDate: string | null }) => {
	const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});
	const homeworkManager = new HomeworkManager();
	const navigate = useRouteManager();

	const handleDeleteBtnClick = async (homeworkID: string) => {
		if (!confirm("本当にこの課題を削除しますか？")) {
			return;
		}
		try {
			await homeworkManager.deleteHomework(homeworkID);
			alert("課題が正常に削除されました。");
			window.location.reload();
		} catch (e) {
			alert(handleAppError(e));
		}
	};

	const toggleExpanded = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const truncateText = (text: string, maxLength = 120) => {
		if (!text || text.length <= maxLength) return text;
		return text.slice(0, maxLength) + "...";
	};

	const isLongDescription = (text: string | null) => {
		return text !== null && text.length > 120;
	};

	return (
		<div key={item.id} onClick={() => navigate.toStudentHomeworkStatus(item.id)} className="card-hover relative p-5 group overflow-hidden break-words">
			{/* Title */}
			<h3 className="text-xl font-semibold text-adaptive mb-2 pr-24">{item.title}</h3>

			{/* Description */}
			{item.description && (
				<div className="mb-3">
					<p className="text-adaptive-secondary text-sm leading-relaxed">{expandedCards[item.id] ? item.description : truncateText(item.description)}</p>
					{isLongDescription(item.description) && (
						<button onClick={(e) => toggleExpanded(item.id, e)} className="mt-2 flex items-center gap-1 text-primary text-sm font-medium transition-colors">
							{expandedCards[item.id] ? (
								<>
									<span>表示を減らす</span>
									<ChevronUp size={16} />
								</>
							) : (
								<>
									<span>もっと見る</span>
									<ChevronDown size={16} />
								</>
							)}
						</button>
					)}
				</div>
			)}

			{/* Due Date */}
			{item.dueDate && (
				<div className="flex items-center gap-2 text-sm text-adaptive-secondary mb-3">
					<span className="font-medium">締め切り日：</span>
					<span>{new Date(item.dueDate).toLocaleDateString("ja-JP")}</span>
				</div>
			)}

			{/* Action Buttons */}
			<div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
				{/* Edit Button */}
				<button
					onClick={(e) => {
						e.stopPropagation();
						navigate.toStudentHomeworkStatus(item.id);
					}}
					className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-white hover:bg-white hover:text-primary border border-transparent hover:border-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
					title="編集"
					aria-label="Edit Homework"
				>
					<Pencil size={18} />
				</button>

				{/* Delete Button */}
				<button
					onClick={(e) => {
						e.stopPropagation();
						handleDeleteBtnClick(item.id);
					}}
					className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-600 text-white hover:bg-white hover:text-red-600 border border-transparent hover:border-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-1"
					title="削除"
					aria-label="Delete Homework"
				>
					<Trash2 size={18} />
				</button>
			</div>
		</div>
	);
};
