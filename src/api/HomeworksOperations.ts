import { type Homework, transformHomeworkResponse} from "../types/Homework.js";


export const fetchHomeworkListForClass = async (
    classID: string
): Promise<Homework[]> => {
    const baseURL = `${import.meta.env.VITE_API_ENDPOINT}/homework/get_homework.php`
    const API_KEY = import.meta.env.VITE_API_KEY as string

    const params = new URLSearchParams({ class_id: classID });
    const endpoint = `${baseURL}?${params.toString()}`;

    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: API_KEY,
        },
    })

    const result = await response.json() as { status: "success" | "error", message: string, data: string | null};
    if(result.status === "success") {
        if(!result.data) return [];
        try {
            const decodedData = JSON.parse(result.data) as any[];
            return decodedData.map(transformHomeworkResponse);

        } catch(error) {
            console.error("❌ クラスリストの取得に失敗しました:", error);
            throw error;
        }
    } else {
        throw new Error(result.message);
    }
}


export const addNewHomework = async (
    classID: string,
    teacherID: string,
    title: string,
    description: string | null,
    dueDate: string | null
): Promise<void> => {
    const endPoint = `${import.meta.env.VITE_API_ENDPOINT}/homework/add_homework.php`
    const apiKey = import.meta.env.VITE_TEACHER_APIKEY as string
    const dueDateInISO = new Date(`${dueDate}T23:59:00Z`).toISOString();

    const body = JSON.stringify({
        teacher_id: teacherID,
        class_id: classID,
        title: title,
        description: description,
        due_date: dueDateInISO
    })

    const response = await fetch(endPoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: apiKey,
        },
        body,
    })

    const result = await response.json() as { status: "success" | "error", message: string};

    if(result.status === "success") {
        console.log("✅ Homework 保存成功。");
    } else {
        throw new Error(result.message);
    }
}