import SignInView from "./View/SignInView.js";
import { MainDashboardView } from "./View/MainDashboardView.js";
import { Routes, Route } from "react-router-dom";
import { ApiKeyCheckBeforeRegistration } from "./View/TeacherApiKeyValidationForm.js";
import CreateClassView from "./View/CreateClassView.js";
import { HomeworkListView } from "./View/HomeworkListView.js";
import { CreateHomeworkPage } from "./View/CreateHomeworkView.js";
import { StudentHomeworkStatusView } from "./View/StudentHomeworkStatusView.js";
import { Paths } from "./Router/Paths.js";
import { GuestRoute } from "./Router/GuestRoute.js";
import { ProtectedRoute } from "./Router/ProtectedRoute.js";
import { NameRegistrationView } from "./View/NameRegistrationView.js";

const App = () => {
	return (
		<div className="w-full mx-auto">
			<Routes>
				{/* ログインページ */}
				<Route path={Paths.LOGIN} element={<GuestRoute>{<SignInView />}</GuestRoute>} />

				{/* APIキー検証ページ */}
				<Route path={Paths.API_KEY_VALIDATION} element={<ProtectedRoute>{(authData) => <ApiKeyCheckBeforeRegistration authData={authData} />}</ProtectedRoute>} />

				{/* 名前登録ページ */}
				<Route path={Paths.NAME_REGISTRATION} element={<ProtectedRoute>{(authData) => <NameRegistrationView authData={authData} />}</ProtectedRoute>} />

				{/* メインページ */}
				<Route path={Paths.MAIN_DASHBOARD} element={<ProtectedRoute>{(_) => <MainDashboardView />}</ProtectedRoute>} />

				{/* クラス追加ページ */}
				<Route path={Paths.CREATE_CLASS} element={<ProtectedRoute>{(authData) => <CreateClassView authData={authData} />}</ProtectedRoute>} />

				{/* クラス詳細ページ */}
				<Route path={Paths.CLASS_DETAIL} element={<ProtectedRoute>{(_) => <HomeworkListView />}</ProtectedRoute>} />

				{/* 課題追加ページ */}
				<Route path={Paths.CREATE_HOMEWORK} element={<ProtectedRoute>{(authData) => <CreateHomeworkPage authData={authData} />}</ProtectedRoute>} />

				{/* 生徒一人一人の課題状況ページ */}
				<Route path={Paths.STUDENT_HOMEWORK_STATUS} element={<StudentHomeworkStatusView />} />
			</Routes>
		</div>
	);
};

export default App;
