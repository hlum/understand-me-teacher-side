import { type Homework, type HomeworkWithSubmissionStatus } from "../Entity/Homework.js";


export interface HomeworkManagerInterface {
    fetchHomeworkListForClass(classID: string): Promise<Homework[]>;

    addNewHomework(
        classID: string,
        teacherID: string,
        title: string,
        description: string | null,
        dueDate: string | null
    ): Promise<void>;

    fetchHomeworkWithSubmissionStatusForAllStudents(
        homeworkID: string
    ): Promise<HomeworkWithSubmissionStatus[]>;
}