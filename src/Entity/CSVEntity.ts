import type { SubmissionState } from "./Homework.js";

export type CSVEntity = {
	studentID: string;
	projectLink: string | null;
	homeworkTitle: string;
	score: number;
	submissionState: SubmissionState;
	submittedAt: string | null;
	homeworkDueDate: string | null;
};

export const labelForCSVEntity = (key: keyof CSVEntity): string[] => {
	switch (key) {
		case "studentID":
			return ["学籍番号"];
		case "projectLink":
			return ["プロジェクトのリンク"];
		case "homeworkTitle":
			return ["宿題のタイトル"];
		case "score":
			return ["点数"];
		case "submissionState":
			return ["提出状況"];
		case "submittedAt":
			return ["提出日時"];
		case "homeworkDueDate":
			return ["宿題の締め切り日"];
		default:
			return [key];
	}
};
