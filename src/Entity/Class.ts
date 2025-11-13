export type Class = {
	id: string;
	teacherID: string;
	name: string;
	admissionYear: number;
	majorCode: string;
};

// APIからの生データの型定義
export type RawClassResponse = {
	id: string;
	teacher_id: string;
	name: string;
	admission_year: number;
	major_code: string;
};

// APIレスポンスをClass型に変換する関数
export const transformClassResponse = (raw: RawClassResponse): Class => ({
	id: raw.id,
	name: raw.name,
	teacherID: raw.teacher_id,
	admissionYear: Number(raw.admission_year),
	majorCode: raw.major_code,
});
