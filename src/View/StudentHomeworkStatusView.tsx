import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchHomeworkStatusForAllStudents } from "../Manager/HomeworkManager.js";
import type { HomeworkDetail } from "../Entity/Homework.js";

const StudentHomeworkStatusView = () => {
	const location = useLocation();
	const { homeworkID } = location.state || {};
	const [homeworkWithStatus, setHomeworkWithStatus] = React.useState<
		HomeworkDetail[]
	>([]);

	const [loading, setLoading] = React.useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const homeworkStatus = await fetchHomeworkStatusForAllStudents(
					homeworkID
				);
				setHomeworkWithStatus(homeworkStatus);
			} catch (error) {
				alert("宿題の進捗状況の取得に失敗しました。");
				console.error("Error fetching homework progress:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [homeworkID]);

	if (loading) return <div>Loading...</div>;

	return (
		<>
			{homeworkWithStatus.map((hw) => (
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
							<a
								href={hw.githubFileLink}
								target="_blank"
								rel="noopener noreferrer"
							>
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
