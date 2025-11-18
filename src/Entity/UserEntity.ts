export type UserEntity = {
	id: string;
	name: string;
	email: string;
	role: "teacher" | "student";
	studentCode: string | null;
	admissionYear: number | null;
	majorCode: string | null;
	photoURL: string | null;
};

export type RawUserEntityResponse = {
	id: string;
	email: string;
	name: string;
	role: string;
	student_code: string | null;
	admission_year: number | null;
	major_code: string | null;
	photo_url: string | null;
};

export function transformUserEntityResponse(raw: RawUserEntityResponse): UserEntity {
	return {
		id: raw.id,
		name: raw.name,
		email: raw.email,
		role: raw.role === "teacher" ? "teacher" : "student",
		studentCode: raw.student_code,
		admissionYear: raw.admission_year,
		majorCode: raw.major_code,
		photoURL: raw.photo_url,
	};
}
