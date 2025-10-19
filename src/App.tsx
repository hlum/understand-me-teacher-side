import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase.js";
import type { User } from "firebase/auth";
import { userAlreadyExistsInDB } from "./api/user.js";
import { logOut } from "./api/auth.js";
import Login from "./pages/Login.js";
import { MainDashboardView } from "./pages/MainDashboardView.js";
import { Routes, Route } from "react-router-dom";
import { ApiKeyCheckBeforeRegistration } from "./pages/ApiKeyCheckBeforeRegistration.js";
import { ProtectedRoute } from "./components/ProtectedRoute.js";
import AddNewClassView from "./pages/AddNewClassView.js";
import { ClassDetailPage } from "./pages/ClassDetailPage.js";
import { AddNewHomeworkPage } from "./pages/AddNewHomeworkPage.js";
import { HomeworkProgressPage } from "./pages/HomeworkProgressPage.js";

const App = () => {
	const [user, setUser] = useState<User | null>(null);
	const [userExists, setUserExists] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			setUser(currentUser);

			if (currentUser?.uid) {
				const exists = await userAlreadyExistsInDB(currentUser.uid);
				setUserExists(exists);
			}

			setLoading(false); // 👈 done loading
		});

		return () => unsubscribe();
	}, []);

	const logout = () => logOut();

	// 👇 While Firebase is checking the session, show a loader
	if (loading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
				<div className="relative flex flex-col items-center">
					<div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
					<h2 className="mt-6 text-2xl font-semibold tracking-wide text-blue-400 animate-pulse">
						ダッシュボードローディング中...
					</h2>
					<p className="text-gray-400 mt-2">少々お待ちください</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full mx-auto">
			<Routes>
				{/* ログインページ */}
				<Route path="/login" element={<Login />} />

				{/* メインページ */}
				<Route
					path="/"
					element={
						<ProtectedRoute user={user}>
							{userExists ? (
								<MainDashboardView user={user!} />
							) : (
								<ApiKeyCheckBeforeRegistration
									user={user!}
									setUserExists={setUserExists}
								/>
							)}
						</ProtectedRoute>
					}
				/>

				{/* クラス追加ページ */}
				<Route
					path="/addNewClassView"
					element={
						<ProtectedRoute user={user}>
							<AddNewClassView user={user!} />
						</ProtectedRoute>
					}
				/>

				{/* クラス詳細ページ */}
				<Route
					path="/classDetail/:classID"
					element={<ClassDetailPage />}
				/>

				{/* 課題追加ページ */}
				<Route
					path="/addNewHomeworkPage"
					element={<AddNewHomeworkPage />}
				/>

				<Route
					path="/homeworkDetail"
					element={<HomeworkProgressPage />}
				/>
			</Routes>
		</div>
	);
};

export default App;
