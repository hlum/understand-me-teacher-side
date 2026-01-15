import { useState } from "react";
import { type HomeworkManagerInterface } from "../ManagerInterface/HomeworkManagerInterface.js";
import { handleAppError } from "../Helper/handleAppError.js";
import type { User } from "firebase/auth/web-extension";

export const useCreateHomeworkViewModel = (classID: string, homeworkManager: HomeworkManagerInterface, authData: User) => {
	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [dueDate, setDueDate] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const addHomework = async () => {
		if (!title || !dueDate) {
			alert("課題名と締め切り日は必須です。");
			return;
		}

		if (!classID) {
			alert("科目の情報取得に失敗しました。前のページに戻って再度お試しください。");
			return;
		}

		try {
			setLoading(true);
			await homeworkManager.addHomework(classID, authData.uid, title, description, dueDate);
			alert("課題を追加しました！");
			setTitle("");
			setDescription("");
			setDueDate("");
		} catch (error) {
			alert(handleAppError(error));
		} finally {
			setLoading(false);
		}
	};

	return { title, setTitle, description, setDescription, dueDate, setDueDate, loading, addHomework };
};
