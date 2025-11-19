import { useState } from "react";
import { auth } from "../firebase/firebase.js";
import { type HomeworkManagerInterface } from "../ManagerInterface/HomeworkManagerInterface.js";
import { handleAppError } from "../Helper/handleAppError.js";

export const useCreateHomeworkViewModel = (classID: string, homeworkManager: HomeworkManagerInterface) => {
	const [authData, setAuthData] = useState(auth.currentUser);
	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [dueDate, setDueDate] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	if (authData === null) {
		return;
	}

	const addNewHomework = async () => {
		// TODO : 締切の日を過去日や今日に設定できないようにする
		if (!title || !dueDate) {
			alert("課題名と締め切り日は必須です。");
			return;
		}

		try {
			setLoading(true);
			await homeworkManager.addNewHomework(classID, authData.uid, title, description, dueDate);
			alert("課題を追加しました ✅");
			setTitle("");
			setDescription("");
			setDueDate("");
		} catch (error) {
			alert(handleAppError(error));
		} finally {
			setLoading(false);
		}
	};

	return { title, setTitle, description, setDescription, dueDate, setDueDate, loading, addNewHomework };
};
