import { useNavigate } from "react-router-dom";
import { usePathBuilder } from "./usePathBuilder.js";

export const useRouteManager = () => {
	const navigate = useNavigate();
	const paths = usePathBuilder();

	return {
		toMainDashboard: () => navigate(paths.mainDashboard()),
		toCreateClass: () => navigate(paths.createClass()),
		toClassDetail: (classID: string) => navigate(paths.classDetail(classID)),
		toCreateHomework: (classID: string) => navigate(paths.createHomework(classID)),
		toStudentHomeworkStatus: (homeworkID: string) => navigate(paths.studentHomeworkStatus(homeworkID)),

		// Prevent browser back button
		toLogin: () => navigate(paths.login(), { replace: true }),
	};
};
