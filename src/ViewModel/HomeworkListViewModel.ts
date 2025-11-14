import { type HomeworkManagerInterface } from "../ManagerInterface/HomeworkManagerInterface.js";
import { type Class } from "../Entity/Class.js";
import { useEffect, useState } from "react";
import { type Homework } from "../Entity/Homework.js";
import { type ClassManagerInterface } from "../ManagerInterface/ClassManagerInterface.js";
import { DataParseError, NetworkError, APIError } from "../Helper/CustomErrors.js";

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
				if (error instanceof APIError) {
					alert("API側でエラーが発生しました。もう一度お試しください。");
					console.error("APIError: ", error);
				} else if (error instanceof NetworkError) {
					alert("ネットワークエラーが発生しました。接続を確認して、もう一度お試しください。");
					console.error("NetworkError: ", error);
				} else if (error instanceof DataParseError) {
					alert("データのデコード中にエラーが発生しました。");
					console.error("DataParseError: ", error);
				} else {
					alert("クラスの詳細を取得中にエラーが発生しました。");
					console.error("Error: ", error);
				}
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
				if (error instanceof APIError) {
					alert("API側でエラーが発生しました。もう一度お試しください。");
					console.error("APIError: ", error);
				} else if (error instanceof NetworkError) {
					alert("ネットワークエラーが発生しました。接続を確認して、もう一度お試しください。");
					console.error("NetworkError: ", error);
				} else if (error instanceof DataParseError) {
					alert("データのデコード中にエラーが発生しました。");
					console.error("DataParseError: ", error);
				} else {
					alert("課題リストの取得中にエラーが発生しました。");
					console.error("Error: ", error);
				}
			} finally {
				setLoading(false);
			}
		};
		loadHomeworks();
	}, [classDetail]);

	return { classDetail, homeworks, loading };
};
