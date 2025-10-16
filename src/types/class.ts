export type Class = {
    id: string,
    teacherID: string,
    name: string,
    admissionYear: number,
    majorCode: string
}

export const transformClassResponse = (raw: any): Class => ({
    id: raw.class_id,
    name: raw.name,
    teacherID: raw.teacher_id,
    admissionYear: Number(raw.admission_year),
    majorCode: raw.major_code
});