// 課題一覧のときに使う課題の型
export type Homework = {
	id: string;
	teacherID: string;
	classID: string;
	title: string;
	description: string | null;
	dueDate: string | null;
};

// APIからの生データの型定義
export type RawHomeworkResponse = {
	id: string;
	teacher_id: string;
	class_id: string;
	title: string;
	description: string | null;
	due_date: string | null;
};

// APIレスポンスをHomework型に変換する関数
export const transformHomeworkResponse = (raw: RawHomeworkResponse): Homework => ({
	id: raw.id,
	teacherID: raw.teacher_id,
	classID: raw.class_id,
	title: raw.title,
	description: raw.description,
	dueDate: raw.due_date,
});

// --------------------------------------------------------------------------------

// 学生ごとの課題詳細情報の型（進捗状況などを含む）
export type HomeworkWithSubmissionStatus = {
	id: string;
	userID: string;
	userEmail: string;
	userStudentID: string;
	title: string;
	classID: string;
	description: string | null;
	dueDate: string | null;
	githubFileLink: string | null;
	jobStatus: string | null;
	score: number;
	submittedAt: string | null;
	submissionState: SubmissionState;
};

export type SubmissionState = "notAssigned" | "generatingQuestions" | "questionGenerated" | "completed";

export const submissionStateLabel = (state: SubmissionState): string => {
	switch (state) {
		case "notAssigned":
			return "未提出";
		case "generatingQuestions":
			return "質問生成中";
		case "questionGenerated":
			return "質問生成完了";
		case "completed":
			return "完了";
		default:
			return "不明な状態";
	}
};

// APIからの生データの型定義
export type RawHomeworkWithSubmissionStatusResponse = {
	id: string;
	user_id: string;
	user_email: string;
	title: string;
	class_id: string;
	user_student_id: string;
	description: string | null;
	due_date: string | null;
	github_file_link: string | null;
	job_status: string | null;
	score: number;
	submitted_at: string | null;
	submission_state: SubmissionState;
};

// APIレスポンスをHomeworkWithSubmissionStatus型に変換する関数
export const transformHomeworkWithSubmissionStatusResponse = (raw: RawHomeworkWithSubmissionStatusResponse): HomeworkWithSubmissionStatus => ({
	id: raw.id,
	userID: raw.user_id,
	userEmail: raw.user_email,
	userStudentID: raw.user_student_id,
	title: raw.title,
	classID: raw.class_id,
	description: raw.description,
	dueDate: raw.due_date,
	githubFileLink: raw.github_file_link,
	jobStatus: raw.job_status,
	score: raw.score,
	submissionState: raw.submission_state,
	submittedAt: raw.submitted_at,
});
