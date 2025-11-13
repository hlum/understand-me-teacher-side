
import { type Class } from "../Entity/Class.js";

export interface ClassManagerInterface {
    addNewClass(newClass: Class): Promise<void>;
    fetchClass(classID: string): Promise<Class>;
    fetchClassesForTeacher(teacherID: string): Promise<Class[]>;
}