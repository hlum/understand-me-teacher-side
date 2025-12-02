import type { Homework } from "@/Entity/Homework.js";
import { handleAppError } from "@/Helper/handleAppError.js";
import type { HomeworkManagerInterface } from "@/ManagerInterface/HomeworkManagerInterface.js";
import type { User } from "firebase/auth";
import { useEffect, useState } from "react";

export const useEditHomeworkViewModel = (authData: User, homeworkID: string, homeworkManager: HomeworkManagerInterface) => {
	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string | null>(null);
	const [dueDate, setDueDate] = useState<string | null>(null);

	const [loading, setLoading] = useState<boolean>(false);
	const [isUpdating, setIsUpdating] = useState<boolean>(false);

	const [originalHomework, setOriginalHomework] = useState<Homework | null>(null);

	useEffect(() => {
		const fetchOriginalHomework = async () => {
			try {
				setLoading(true);
				const homeworkData = await homeworkManager.fetchHomework(homeworkID);
				setOriginalHomework(homeworkData);
				setTitle(homeworkData.title);
				setDescription(homeworkData.description ?? "");

				// rawDate = "2024-06-30 23:59:59" 形式なので、日付部分だけ取り出す
				const rawDate = homeworkData.dueDate;
				const formattedDate = rawDate ? rawDate.split(" ")[0] : null;
				setDueDate(formattedDate ?? null);
			} catch (error) {
				alert(handleAppError(error));
			} finally {
				setLoading(false);
			}
		};
		fetchOriginalHomework();
	}, [homeworkID]);

	const updateHomework = async () => {
		try {
			setIsUpdating(true);

			// フィールドの有効性チェック
			if (title.trim() === "") {
				alert("課題名を入力してください。");
				return;
			}

			if (description !== null && description.trim() === "") {
				setDescription(null);
			}

			// ① dueDate の加工はローカル変数で行う
			let due = dueDate?.trim() === "" ? null : dueDate;

			// ② バリデーションもこのローカル変数で行う
			if (due !== null) {
				const dueDateObj = new Date(due);
				if (isNaN(dueDateObj.getTime())) {
					alert("締め切り日は有効な日付形式で入力してください。");
					return;
				}

				const today = new Date();
				today.setHours(0, 0, 0, 0);

				if (dueDateObj < today) {
					alert("締め切り日は今日以降の日付を指定してください。");
					return;
				}
			}

			// ③ 更新処理
			await homeworkManager.updateHomework(
				homeworkID,
				title !== originalHomework?.title ? title : undefined,
				description !== originalHomework?.description ? description : undefined,
				due !== originalHomework?.dueDate ? due ?? null : null
			);
			alert("課題の更新に成功しました！");

			// reload
			window.location.reload();
		} catch (error) {
			alert(handleAppError(error));
		} finally {
			setIsUpdating(false);
		}
	};

	return { originalHomework, title, setTitle, description, setDescription, dueDate, setDueDate, loading, isUpdating, updateHomework };
};
