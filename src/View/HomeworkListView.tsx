import { useParams } from "react-router-dom";
import { useHomeworkListViewModel } from "../ViewModel/HomeworkListViewModel.js";
import { ClassManager } from "../Manager/ClassManager.js";
import { HomeworkManager } from "../Manager/HomeworkManager.js";
import { useRouteManager } from "../Router/useRouteManager.js";

export const HomeworkListView = () => {
	const navigate = useRouteManager();
	const { classID } = useParams<{ classID: string }>();
	const classManager = new ClassManager();
	const homeworkManager = new HomeworkManager();

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
						<h1 className="text-3xl font-bold text-white mb-2">{classDetail.name}</h1>
						<p className="text-gray-300 text-sm space-x-6">
							<span>
								<span className="font-semibold text-primary-light">入学年度：</span>
								{classDetail.admissionYear}
							</span>
							<span>
								<span className="font-semibold text-accent-light">専攻：</span>
								{classDetail.majorCode.toUpperCase()}
							</span>
						</p>
					</div>

					<button onClick={() => navigate.toCreateHomework(classID)} className="btn-primary-sm">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
						</svg>
						課題を追加
					</button>
				</div>

				{/* Homework Section */}
				<div>
					<h2 className="text-2xl font-semibold text-white mb-6 border-b border-white/10 pb-2">課題一覧</h2>

					{homeworks.length === 0 ? (
						<div className="py-12 text-center text-gray-400 text-lg">このクラスにはまだ課題がありません。</div>
					) : (
						<div className="grid gap-5">
							{homeworks.map((item) => (
								<div key={item.id} onClick={() => navigate.toStudentHomeworkStatus(item.id)} className="card-hover">
									<h3 className="text-xl font-semibold text-white">{item.title}</h3>

									{item.description && <p className="text-gray-300 mt-2 text-sm leading-relaxed">{item.description}</p>}

									{item.dueDate && (
										<p className="text-gray-400 mt-3 text-sm">
											締め切り日：
											<span className="text-primary-light font-medium ml-1">{new Date(item.dueDate).toLocaleDateString("ja-JP")}</span>
										</p>
									)}
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
