import { useLocation, useParams } from "react-router-dom";
import { useHomeworkStatusViewModel } from "../ViewModel/HomeworkStatusViewModel.js";
import { Loading } from "./Components/Loading.js";
import { HomeworkManager } from "../Manager/HomeworkManager.js";

export const StudentHomeworkStatusView = () => {
	const { homeworkID } = useParams<{ homeworkID: string }>();

	if (!homeworkID) {
		return <div>Invalid homework ID</div>;
	}

	const homeworkManager = new HomeworkManager();
	const { loading, homeworkStatusList } = useHomeworkStatusViewModel(homeworkID, homeworkManager);

	if (loading) return <Loading />;

	return (
		<>
			{homeworkStatusList.map((hw) => (
				<div
					key={hw.userID}
					style={{
						marginBottom: "20px",
						padding: "10px",
						border: "1px solid #ccc",
					}}
				>
					<h3>{hw.userEmail} </h3>
					<p> Title: {hw.title} </p>
					<p> Description: {hw.description || "N/A"} </p>
					<p> Due Date: {hw.dueDate || "N/A"} </p>
					<p>
						GitHub File Link:{" "}
						{hw.githubFileLink ? (
							<a href={hw.githubFileLink} target="_blank" rel="noopener noreferrer">
								{hw.githubFileLink}
							</a>
						) : (
							"N/A"
						)}
					</p>
					<p> Job Status: {hw.jobStatus || "N/A"} </p>
					<p> Score: {hw.score} </p>
					<p> Submission State: {hw.submissionState} </p>
				</div>
			))}
		</>
	);
};
