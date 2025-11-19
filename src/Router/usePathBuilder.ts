import { Paths } from "./Paths.js";

export const usePathBuilder = () => {
	return {
		login: () => Paths.LOGIN,
		apiKeyValidation: () => Paths.API_KEY_VALIDATION,
		nameRegistration: () => Paths.NAME_REGISTRATION,

		mainDashboard: () => Paths.MAIN_DASHBOARD,
		createClass: () => Paths.CREATE_CLASS,
		editClass: (classID: string) => Paths.EDIT_CLASS.replace(":classID", classID),
		classDetail: (classID: string) => Paths.CLASS_DETAIL.replace(":classID", classID),
		createHomework: (classID: string) => Paths.CREATE_HOMEWORK.replace(":classID", classID),
		studentHomeworkStatus: (homeworkID: string) => Paths.STUDENT_HOMEWORK_STATUS.replace(":homeworkID", homeworkID),
	};
};
