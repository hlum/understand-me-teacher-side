import { useEffect, useState } from "react";
import { type Class } from "../Entity/Class.js";
import { type Homework } from "../Entity/Homework.js";
import { handleAppError } from "../Helper/handleAppError.js";
import { type ClassManagerInterface } from "../ManagerInterface/ClassManagerInterface.js";
import { type HomeworkManagerInterface } from "../ManagerInterface/HomeworkManagerInterface.js";

export const useHomeworkListViewModel = (classID: string, classManager: ClassManagerInterface, homeworkManager: HomeworkManagerInterface) => {
	const [classDetail, setClassDetail] = useState<Class | null>(null);
	const [homeworks, setHomeworks] = useState<Homework[]>([]);
	const [loading, setLoading] = useState(true);

	// 科目 を取得
	useEffect(() => {
		const loadClassDetail = async () => {
			if (!classID) {
				alert("クラスIDが提供されていません。");
				return;
			}

			try {
				setLoading(true);

				const classData = await classManager.fetchClass(classID);
				setClassDetail(classData);
			} catch (error: unknown) {
				alert(handleAppError(error));
			} finally {
				setLoading(false);
			}
		};
		loadClassDetail();
	}, [classID]);

	// 科目の課題リストを取得
	useEffect(() => {
		const loadHomeworks = async () => {
			if (!classDetail?.id) return;
			try {
				setLoading(true);
				const homeworkList = await homeworkManager.fetchHomeworkListForClass(classDetail.id);
				setHomeworks(homeworkList);
			} catch (error: unknown) {
				alert(handleAppError(error));
			} finally {
				setLoading(false);
			}
		};
		loadHomeworks();
	}, [classDetail]);

	const deleteClass = async (): Promise<boolean> => {
		try {
			setLoading(true);
			await classManager.deleteClass(classID);
			return true;
		} catch (error: unknown) {
			alert(handleAppError(error));
			return false;
		} finally {
			setLoading(false);
		}
	};

	return { classDetail, homeworks, loading, deleteClass };
};
