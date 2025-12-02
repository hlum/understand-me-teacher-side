import { useParams } from "react-router-dom";
import { useHomeworkListViewModel } from "../ViewModel/HomeworkListViewModel.js";
import { ClassManager } from "../Manager/ClassManager.js";
import { HomeworkManager } from "../Manager/HomeworkManager.js";
import { useRouteManager } from "../Router/useRouteManager.js";
import { handleAppError } from "@/Helper/handleAppError.js";

export const HomeworkListView = () => {
	const navigate = useRouteManager();
	const { classID } = useParams<{ classID: string }>();
	const classManager = new ClassManager();
	const homeworkManager = new HomeworkManager();

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

	if (!classID) {
		return <div className="flex justify-center items-center h-screen text-red-500 text-lg">クラスIDが提供されていません。</div>;
	}

	const { classDetail, homeworks, loading } = useHomeworkListViewModel(classID, classManager, homeworkManager);

	if (loading) {
		return <div className="flex justify-center items-center h-screen text-gray-500 text-lg">読み込み中です…</div>;
	}

	if (!classDetail) {
		return <div className="flex justify-center items-center h-screen text-red-500 text-lg">クラスが見つかりません。</div>;
	}

	return (
		<div className="page-bg py-12 px-6">
			<div className="max-w-screen mx-auto card p-8">
				{/* Header */}
				<div className="flex flex-wrap justify-between items-center mb-10 gap-4">
					<div>
						<h1 className="text-3xl font-bold text-adaptive mb-2">{classDetail.name}</h1>
						<p className="text-adaptive-secondary text-sm space-x-6">
							<span>
								<span className="font-semibold text-primary-light">入学年度：</span>
								{classDetail.admissionYear}
							</span>
							<span>
								<span className="font-semibold text-accent-light">専攻：</span>
								{classDetail.majorCode.toUpperCase()}
							</span>
							{classDetail.classCode !== null ? (
								<span>
									<span className="font-semibold text-green-500">クラスコード：</span>
									{classDetail.classCode}
								</span>
							) : (
								<></>
							)}
						</p>
					</div>

					<div className="flex gap-2">
						<button onClick={() => navigate.toEditClass(classID)} className="btn-primary-sm">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
								/>
							</svg>
							クラスを編集
						</button>
						<button onClick={() => navigate.toCreateHomework(classID)} className="btn-primary-sm">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
							</svg>
							課題を追加
						</button>
					</div>
				</div>

				{/* Homework Section */}
				<div>
					<h2 className="text-2xl font-semibold text-adaptive mb-6 border-b border-gray-300 dark:border-white/10 pb-2">課題一覧</h2>

					{homeworks.length === 0 ? (
						<div className="py-12 text-center text-adaptive-secondary text-lg">このクラスにはまだ課題がありません。</div>
					) : (
						<div className="grid gap-5">
							{homeworks.map((item) => (
								<div key={item.id} onClick={() => navigate.toStudentHomeworkStatus(item.id)} className="card-hover relative p-4">
									<h3 className="text-xl font-semibold text-adaptive">{item.title}</h3>

									{item.description && <p className="text-adaptive-secondary mt-2 text-sm leading-relaxed">{item.description}</p>}

									{item.dueDate && (
										<p className="text-gray-400 mt-3 text-sm">
											締め切り日：
											<span className="text-primary-light font-medium ml-1">{new Date(item.dueDate).toLocaleDateString("ja-JP")}</span>
										</p>
									)}

									{/* Delete button */}
									<button
										className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-600 flex items-center gap-1 mr-3"
										onClick={(e) => {
											e.stopPropagation();
											handleDeleteBtnClick(item.id);
										}}
									>
										<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

// Type
export type Homework = {
	id: string;
	teacherID: string;
	classID: string;
	title: string;
	description: string | null;
	dueDate: string | null;
};
