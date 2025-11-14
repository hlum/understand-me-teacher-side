import { Paths } from "./Paths.js";

export const usePathBuilder = () => {
	return {
		mainDashboard: () => Paths.MAIN_DASHBOARD,
		createClass: () => Paths.CREATE_CLASS,
		classDetail: (classID: string) => Paths.CLASS_DETAIL.replace(":classID", classID),
		createHomework: (classID: string) => Paths.CREATE_HOMEWORK.replace(":classID", classID),
		studentHomeworkStatus: (homeworkID: string) => Paths.STUDENT_HOMEWORK_STATUS.replace(":homeworkID", homeworkID),
		login: () => Paths.LOGIN,
	};
};
