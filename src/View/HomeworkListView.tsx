import { useParams } from "react-router-dom";
import { ClassManager } from "../Manager/ClassManager.js";
import { HomeworkManager } from "../Manager/HomeworkManager.js";
import { useRouteManager } from "../Router/useRouteManager.js";
import { useHomeworkListViewModel } from "../ViewModel/HomeworkListViewModel.js";
import { HomeworkCard } from "./Components/HomeworkCard.js";
import { Loading } from "./Components/Loading.js";

export const HomeworkListView = () => {
	const navigate = useRouteManager();
	const { classID } = useParams<{ classID: string }>();
	const classManager = new ClassManager();
	const homeworkManager = new HomeworkManager();

	if (!classID) {
		return <div className="flex justify-center items-center h-screen text-red-500 text-lg">クラスIDが提供されていません。</div>;
	}

	const { classDetail, homeworks, loading, deleteClass } = useHomeworkListViewModel(classID, classManager, homeworkManager);

	const handleDeleteClass = async () => {
		if (!window.confirm(`「${classDetail?.name || "このクラス"}」を削除してもよろしいですか？この操作は取り消せません。`)) {
			return;
		}

		const success = await deleteClass();
		if (success) {
			navigate.toMainDashboard();
		}
	};

	if (loading) {
		return <Loading />;
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
									<span className="font-semibold text-green-500">参加コード：</span>
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
						<button onClick={handleDeleteClass} className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-sm">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
							クラスを削除
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
								<HomeworkCard key={item.id} id={item.id} title={item.title} description={item.description} dueDate={item.dueDate} />
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
