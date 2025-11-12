import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Class } from "../Entity/class.js";
import { fetchClassDetail } from "../Manager/ClassManager.js";
import { fetchHomeworkListForClass } from "../Manager/HomeworkManager.js";

export const ClassDetailView = () => {
	const navigate = useNavigate();
	const { classID } = useParams<{ classID: string }>();
	const [classDetail, setClassDetail] = useState<Class | null>(null);
	const [homeworks, setHomeworks] = useState<Homework[]>([]);
	const [loading, setLoading] = useState(true);

	// Fetch class detail
	useEffect(() => {
		const fetchClass = async () => {
			if (!classID) return;
			try {
				const classData = await fetchClassDetail(classID);
				if (!classData) {
					alert("クラスが見つかりません。");
					return;
				}
				setClassDetail(classData);
			} catch (error) {
				console.error("Error fetching class detail:", error);
			}
		};
		fetchClass();
	}, [classID]);

	// Fetch homeworks when classDetail is available
	useEffect(() => {
		const fetchHomeworks = async () => {
			if (!classDetail?.id) return;
			try {
				const homeworks = await fetchHomeworkListForClass(
					classDetail.id
				);
				setHomeworks(homeworks);
			} catch (error) {
				console.error("Error fetching homeworks:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchHomeworks();
	}, [classDetail]);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen text-gray-500 text-lg">
				読み込み中です…
			</div>
		);
	}

	if (!classDetail) {
		return (
			<div className="flex justify-center items-center h-screen text-red-500 text-lg">
				クラスが見つかりません。
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-900 py-12 px-6">
			<div className="max-w-screen mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
				{/* Header */}
				<div className="flex flex-wrap justify-between items-center mb-10 gap-4">
					<div>
						<h1 className="text-3xl font-bold text-white mb-2">
							{classDetail.name}
						</h1>
						<p className="text-gray-300 text-sm space-x-6">
							<span>
								<span className="font-semibold text-blue-400">
									入学年度：
								</span>
								{classDetail.admissionYear}
							</span>
							<span>
								<span className="font-semibold text-green-400">
									専攻：
								</span>
								{classDetail.majorCode.toUpperCase()}
							</span>
						</p>
					</div>

					<button
						onClick={() =>
							navigate("/addNewHomeworkPage", {
								state: {
									classID: classDetail.id,
									teacherID: classDetail?.teacherID,
								},
							})
						}
						className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:shadow-[0_0_20px_rgba(37,99,235,0.7)] hover:-translate-y-0.5 transition-all duration-300 ease-in-out cursor-pointer"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 mr-2"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 4v16m8-8H4"
							/>
						</svg>
						課題を追加
					</button>
				</div>

				{/* Homework Section */}
				<div>
					<h2 className="text-2xl font-semibold text-white mb-6 border-b border-white/10 pb-2">
						課題一覧
					</h2>

					{homeworks.length === 0 ? (
						<div className="py-12 text-center text-gray-400 text-lg">
							このクラスにはまだ課題がありません。
						</div>
					) : (
						<div className="grid gap-5">
							{homeworks.map((item) => (
								<div
									key={item.id}
									onClick={() =>
										navigate(`/homeworkDetail`, {
											state: { homeworkID: item.id },
										})
									}
									className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-md hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
								>
									<h3 className="text-xl font-semibold text-white">
										{item.title}
									</h3>

									{item.description && (
										<p className="text-gray-300 mt-2 text-sm leading-relaxed">
											{item.description}
										</p>
									)}

									{item.dueDate && (
										<p className="text-gray-400 mt-3 text-sm">
											締め切り日：
											<span className="text-blue-400 font-medium ml-1">
												{new Date(
													item.dueDate
												).toLocaleDateString("ja-JP")}
											</span>
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
