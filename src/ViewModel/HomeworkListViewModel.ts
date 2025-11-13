import { type HomeworkManagerInterface } from "../ManagerInterface/HomeworkManagerInterface.js";


export class HomeworkListViewModel {
    private homeworkManager: HomeworkManagerInterface;

    constructor(homeworkManager: HomeworkManagerInterface){
        this.homeworkManager = homeworkManager;
    }

    async fetchClass(classID: string): Promise<void> {
                if (!classID) return;
                try {
                    const classData = await this.homeworkManager.fetchClassDetail(classID);
                    if (!classData) {
                        alert("クラスが見つかりません。");
                        return;
                    }
                    setClassDetail(classData);
                } catch (error) {
                    console.error("Error fetching class detail:", error);
                }
            }

}