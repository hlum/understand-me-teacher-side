import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase.js";
import type { User } from "firebase/auth";
import { userAlreadyExistsInDB } from "./Manager/UserManager.js";
import { logOut } from "./Manager/AuthManager.js";
import SignInView from "./View/SignInView.js";
import { MainDashboardView } from "./View/MainDashboardView.js";
import { Routes, Route } from "react-router-dom";
import { ApiKeyCheckBeforeRegistration } from "./View/TeacherApiKeyValidationForm.js";
import { ProtectedRoute } from "./View/Components/ProtectedRoute.js";
import CreateClassView from "./View/CreateClassView.js";
import { HomeworkListView } from "./View/HomeworkListView.js";
import { CreateHomeworkPage } from "./View/CreateHomeworkPage.js";
import { StudentHomeworkStatusView } from "./View/StudentHomeworkStatusView.js";
import { Loading } from "./View/Components/Loading.js";

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
		return <Loading />;
	}

	return (
		<div className="w-full mx-auto">
			<Routes>
				{/* ログインページ */}
				<Route path="/login" element={<SignInView />} />

				{/* メインページ */}
				<Route
					path="/"
					element={
						<ProtectedRoute user={user}>{userExists ? <MainDashboardView user={user!} /> : <ApiKeyCheckBeforeRegistration user={user!} setUserExists={setUserExists} />}</ProtectedRoute>
					}
				/>

				{/* クラス追加ページ */}
				<Route
					path="/addNewClassView"
					element={
						<ProtectedRoute user={user}>
							<CreateClassView user={user!} />
						</ProtectedRoute>
					}
				/>

				{/* クラス詳細ページ */}
				<Route path="/classDetail/:classID" element={<HomeworkListView />} />

				{/* 課題追加ページ */}
				<Route path="/addNewHomeworkPage" element={<CreateHomeworkPage />} />

				<Route path="/homeworkDetail" element={<StudentHomeworkStatusView />} />
			</Routes>
		</div>
	);
};

export default App;
