export type Class = {
	id: string;
	teacherID: string;
	name: string;
	admissionYear: number;
	majorCode: string;
	classCode: string | null;
};

export const createClass = (teacherID: string, name: string, admissionYear: string | number, majorCode: string, classCode?: string | null): Class => {
	return {
		id: "", // IDは後でAPIから取得するため空文字で初期化
		teacherID: teacherID,
		name: name,
		admissionYear: Number(admissionYear),
		majorCode: majorCode,
		classCode: classCode ?? null,
	};
};

// APIからの生データの型定義
export type RawClassResponse = {
	id: string;
	teacher_id: string;
	name: string;
	admission_year: number;
	major_code: string;
	class_code: string | null;
};

// APIレスポンスをClass型に変換する関数
export const transformClassResponse = (raw: RawClassResponse): Class => ({
	id: raw.id,
	name: raw.name,
	teacherID: raw.teacher_id,
	admissionYear: Number(raw.admission_year),
	majorCode: raw.major_code,
	classCode: raw.class_code,
});
