import SignInView from "./View/SignInView.js";
import { MainDashboardView } from "./View/MainDashboardView.js";
import { Routes, Route } from "react-router-dom";
import { ApiKeyCheckBeforeRegistration } from "./View/TeacherApiKeyValidationForm.js";
import CreateClassView from "./View/CreateClassView.js";
import EditClassView from "./View/EditClassView.js";
import { HomeworkListView } from "./View/HomeworkListView.js";
import { CreateHomeworkPage } from "./View/CreateHomeworkView.js";
import { StudentHomeworkStatusView } from "./View/StudentHomeworkStatusView.js";
import { Paths } from "./Router/Paths.js";
import { GuestRoute } from "./Router/GuestRoute.js";
import { ProtectedRoute } from "./Router/ProtectedRoute.js";
import { NameRegistrationView } from "./View/NameRegistrationView.js";
import { Loading } from "./View/Components/Loading.js";
import { EditHomeworkView } from "./View/EditHomeworkView.js";

const App = () => {
	return (
		<div className="w-full mx-auto">
			<Routes>
				{/* ログインページ */}
				<Route
					path={Paths.LOGIN}
					element={
						<GuestRoute>
							{(authenticating) => {
								return authenticating ? <Loading /> : <SignInView />;
							}}
						</GuestRoute>
					}
				/>

				{/* APIキー検証ページ */}
				<Route
					path={Paths.API_KEY_VALIDATION}
					element={
						<ProtectedRoute>
							{(authData, authenticating) => {
								return authenticating ? <Loading /> : <ApiKeyCheckBeforeRegistration authData={authData} />;
							}}
						</ProtectedRoute>
					}
				/>

				{/* 名前登録ページ */}
				<Route
					path={Paths.NAME_REGISTRATION}
					element={
						<ProtectedRoute>
							{(authData, authenticating) => {
								return authenticating ? <Loading /> : <NameRegistrationView authData={authData} />;
							}}
						</ProtectedRoute>
					}
				/>

				{/* メインページ */}
				<Route
					path={Paths.MAIN_DASHBOARD}
					element={
						<ProtectedRoute>
							{(authData, authenticating) => {
								return authenticating ? <Loading /> : <MainDashboardView authData={authData} />;
							}}
						</ProtectedRoute>
					}
				/>

				{/* クラス追加ページ */}
				<Route
					path={Paths.CREATE_CLASS}
					element={
						<ProtectedRoute>
							{(authData, authenticating) => {
								return authenticating ? <Loading /> : <CreateClassView authData={authData} />;
							}}
						</ProtectedRoute>
					}
				/>

				{/* クラス編集ページ */}
				<Route
					path={Paths.EDIT_CLASS}
					element={
						<ProtectedRoute>
							{(authData, authenticating) => {
								return authenticating ? <Loading /> : <EditClassView authData={authData} />;
							}}
						</ProtectedRoute>
					}
				/>

				{/* 課題編集ページ */}
				<Route
					path={Paths.EDIT_HOMEWORK}
					element={
						<ProtectedRoute>
							{(authData, authenticating) => {
								return authenticating ? <Loading /> : <EditHomeworkView authData={authData} />;
							}}
						</ProtectedRoute>
					}
				/>

				{/* クラス詳細ページ */}
				<Route
					path={Paths.CLASS_DETAIL}
					element={
						<ProtectedRoute>
							{(_, authenticating) => {
								return authenticating ? <Loading /> : <HomeworkListView />;
							}}
						</ProtectedRoute>
					}
				/>

				{/* 課題追加ページ */}
				<Route
					path={Paths.CREATE_HOMEWORK}
					element={
						<ProtectedRoute>
							{(authData, authenticating) => {
								return authenticating ? <Loading /> : <CreateHomeworkPage authData={authData} />;
							}}
						</ProtectedRoute>
					}
				/>

				{/* 生徒一人一人の課題状況ページ */}
				<Route path={Paths.STUDENT_HOMEWORK_STATUS} element={<ProtectedRoute>{() => <StudentHomeworkStatusView />}</ProtectedRoute>} />
			</Routes>
		</div>
	);
};

export default App;
