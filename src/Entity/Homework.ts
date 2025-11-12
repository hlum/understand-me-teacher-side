export type Homework = {
	id: string;
	teacherID: string;
	classID: string;
	title: string;
	description: string | null;
	dueDate: string | null;
};

export type HomeworkDetail = {
	id: string;
	userID: string;
	userEmail: string;
	title: string;
	classID: string;
	description: string | null;
	dueDate: string | null;
	githubFileLink: string | null;
	jobStatus: string | null;
	score: number;
	submissionState:
	| "notAssigned"
	| "generatingQuestions"
	| "questionGenerated"
	| "completed";
};

export const transformHomeworkDetailResponse = (raw: any): HomeworkDetail => ({
	id: raw.id,
	userID: raw.user_id,
	userEmail: raw.user_email,
	title: raw.title,
	classID: raw.class_id,
	description: raw.description,
	dueDate: raw.due_date,
	githubFileLink: raw.github_file_link,
	jobStatus: raw.job_status,
	score: raw.score,
	submissionState: raw.submission_state,
});

export const transformHomeworkResponse = (raw: any): Homework => ({
	id: raw.id,
	teacherID: raw.teacher_id,
	classID: raw.class_id,
	title: raw.title,
	description: raw.description,
	dueDate: raw.due_date,
});
