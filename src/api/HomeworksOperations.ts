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