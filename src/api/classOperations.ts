import {type Class, transformClassResponse} from "../types/class.js";

export const fetchClassList = async (
    teacherID: string
): Promise<Class[]> => {
    const baseURL = `${import.meta.env.VITE_API_ENDPOINT}/class/get_class.php`
    const API_KEY = import.meta.env.VITE_API_KEY as string

    const params = new URLSearchParams({ teacher_id: teacherID });
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
            return decodedData.map(transformClassResponse);

        } catch(error) {
            console.error("❌ クラスリストの取得に失敗しました:", error);
            throw error;
        }
    } else {
        throw new Error(result.message);
    }
}