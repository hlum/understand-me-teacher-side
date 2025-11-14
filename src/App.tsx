import SignInView from "./View/SignInView.js";
import { MainDashboardView } from "./View/MainDashboardView.js";
import { Routes, Route, Navigate } from "react-router-dom";
import { ApiKeyCheckBeforeRegistration } from "./View/TeacherApiKeyValidationForm.js";
import CreateClassView from "./View/CreateClassView.js";
import { HomeworkListView } from "./View/HomeworkListView.js";
import { CreateHomeworkPage } from "./View/CreateHomeworkView.js";
import { StudentHomeworkStatusView } from "./View/StudentHomeworkStatusView.js";
import { Loading } from "./View/Components/Loading.js";
import { useSessionViewModel } from "./ViewModel/SessionViewModel.js";
import { UserManager } from "./Manager/UserManager.js";
import { AuthManager } from "./Manager/AuthManager.js";
import { Paths } from "./Router/Paths.js";

const App = () => {
	const userManager = new UserManager();
	const authManager = new AuthManager();
	const { authData, userDataSaved, loading, logOut, reloadAfterRegistration } = useSessionViewModel(userManager, authManager);

	// 👇 While Firebase is checking the session, show a loader
	if (loading) {
		return <Loading />;
	}

	if (!authData) {
		return <Navigate to="/login" replace />;
	}

	return (
		<div className="w-full mx-auto">
			<Routes>
				{/* ログインページ */}
				<Route path={Paths.LOGIN} element={<SignInView />} />

				{/* メインページ */}
				<Route
					path={Paths.MAIN_DASHBOARD}
					element={<>{userDataSaved ? <MainDashboardView /> : <ApiKeyCheckBeforeRegistration authData={authData!} onRegisterationComplete={reloadAfterRegistration} />}</>}
				/>

				{/* クラス追加ページ */}
				<Route path={Paths.CREATE_CLASS} element={<CreateClassView />} />

				{/* クラス詳細ページ */}
				<Route path={Paths.CLASS_DETAIL} element={<HomeworkListView />} />

				{/* 課題追加ページ */}
				<Route path={Paths.CREATE_HOMEWORK} element={<CreateHomeworkPage />} />

				<Route path={Paths.STUDENT_HOMEWORK_STATUS} element={<StudentHomeworkStatusView />} />
			</Routes>
		</div>
	);
};

export default App;
