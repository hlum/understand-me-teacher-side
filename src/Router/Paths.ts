export const Paths = {
	MAIN_DASHBOARD: "/" as const,
	API_KEY_VALIDATION: "/apiKeyValidation" as const,
	NAME_REGISTRATION: "/nameRegistration" as const,
	CREATE_CLASS: "/createClass" as const,
	EDIT_CLASS: "/editClass/:classID" as const,
	EDIT_HOMEWORK: "/editHomework/:homeworkID" as const,
	CLASS_DETAIL: "/classDetail/:classID" as const,
	CREATE_HOMEWORK: "/createHomework/:classID" as const,
	STUDENT_HOMEWORK_STATUS: "/homeworkDetail/:homeworkID" as const,
	LOGIN: "/login" as const,
};
