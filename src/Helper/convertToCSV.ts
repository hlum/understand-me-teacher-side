import { type CSVEntity, labelForCSVEntity } from "@/Entity/CSVEntity.js";
import { submissionStateLabel, type SubmissionState } from "@/Entity/Homework.js";

export function convertToCSV(data: CSVEntity[]): string {
	if (data.length === 0) return "";

	if (data.length === 0) {
		return "";
	}
	const headers = Object.keys(data[0]!) as (keyof CSVEntity)[];
	const japaneseHeaders = headers.map((header) => labelForCSVEntity(header));

	const rows = data.map((row) =>
		headers
			.map((header) => {
				let value = row[header];

				// SubmissionStateの場合、日本語ラベルに変換
				if (header === "submissionState") {
					value = submissionStateLabel(value as SubmissionState);
				}
				return JSON.stringify(value ?? "");
			})
			.join(",")
	);

	return [japaneseHeaders.join(","), ...rows].join("\n");
}
