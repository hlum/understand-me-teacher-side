import React, { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import type { Class } from "../Entity/Class.js";
import { fetchClassList } from "../Manager/ClassManager.js";
import { useNavigate } from "react-router-dom";

type MainDashboardViewProps = {
	user: User;
};

const MainDashboardView = ({ user }: MainDashboardViewProps) => {
	const [classes, setClasses] = useState<Class[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchClasses = async () => {
			const classList = await fetchClassList(user.uid);
			setClasses(classList);
		};

		fetchClasses();
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-900 p-8">
			{/* Header Section */}
			<div className="flex flex-wrap justify-between items-center mb-10 gap-6">
				<h1 className="text-3xl sm:text-4xl font-bold text-white">
					クラス管理、{" "}
					<span className="text-green-400">{user.displayName}</span>
				</h1>

				<button
					onClick={() => navigate("/addNewClassView")}
					className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
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
					クラスを追加
				</button>
			</div>

			{/* Class List Section */}
			{classes.length === 0 ? (
				<div className="flex justify-center items-center py-24 text-center">
					<p className="text-gray-400 text-lg">
						担当しているクラスがありません。
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{classes.map((cls) => (
						<div
							key={cls.id}
							onClick={() => navigate(`/classDetail/${cls.id}`)}
							className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-md hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 transition-all duration-300 ease-in-out cursor-pointer"
						>
							<div className="flex justify-between items-start mb-4">
								<h2 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors">
									{cls.name}
								</h2>
							</div>

							<div className="flex flex-wrap gap-2">
								{/* Year Badge */}
								<span className="inline-flex items-center gap-1 bg-gradient-to-br from-blue-950 to-blue-800 text-blue-200 px-3 py-1 rounded-md text-sm font-semibold border border-blue-700 shadow-[inset_0_0_8px_rgba(59,130,246,0.5)]">
									<span className="opacity-70 text-xs">
										第
									</span>
									{cls.admissionYear}
									<span className="opacity-70 text-xs">
										年度
									</span>
								</span>

								{/* Major Badge */}
								<span className="inline-flex items-center gap-1 bg-gradient-to-br from-green-950 to-green-800 text-green-200 px-3 py-1 rounded-md text-sm font-semibold border border-green-700 shadow-[inset_0_0_8px_rgba(74,222,128,0.5)]">
									{cls.majorCode.toUpperCase()}
								</span>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export { MainDashboardView };
