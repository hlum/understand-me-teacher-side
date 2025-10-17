
export type Homework = {
    id: string,
    teacherID: string,
    classID: string,
    title: string,
    description: string | null,
    dueDate: string | null
}

export const transformHomeworkResponse = (raw: any): Homework => ({
    id: raw.id,
    teacherID: raw.teacher_id,
    classID: raw.class_id,
    title: raw.title,
    description: raw.description,
    dueDate: raw.due_date
});