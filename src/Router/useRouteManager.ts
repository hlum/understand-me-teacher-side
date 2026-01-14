import { useNavigate } from "react-router-dom";
import { usePathBuilder } from "./usePathBuilder.js";

export const useRouteManager = () => {
	const navigate = useNavigate();
	const paths = usePathBuilder();

	return {
		toNameRegistration: () => navigate(paths.nameRegistration()),
		toMainDashboard: () => navigate(paths.mainDashboard()),
		toApiKeyValidation: () => navigate(paths.apiKeyValidation()),
		toCreateClass: () => navigate(paths.createClass()),
		toEditClass: (classID: string) => navigate(paths.editClass(classID)),
		toEditHomework: (homeworkID: string) => navigate(paths.editHomework(homeworkID)),
		toClassDetail: (classID: string) => navigate(paths.classDetail(classID)),
		toCreateHomework: (classID: string) => navigate(paths.createHomework(classID)),
		toStudentHomeworkStatus: (homeworkID: string) => navigate(paths.studentHomeworkStatus(homeworkID)),

		// Prevent browser back button
		toLogin: () => navigate(paths.login(), { replace: true }),
	};
};
