import {type Class, transformClassResponse} from "../types/class.js";

export const fetchClassDetail = async (
    classID: string
): Promise<Class | null> => {
    const baseURL = `${import.meta.env.VITE_API_ENDPOINT}/class/get_class.php`
    const API_KEY = import.meta.env.VITE_API_KEY as string

    const params = new URLSearchParams({ id: classID });
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
        if(!result.data) return null;
        try {
            const decodedData = JSON.parse(result.data) as any[];
            return decodedData.map(transformClassResponse)[0] || null;
        } catch(error) {
            console.error("❌ クラス詳細の取得に失敗しました:", error);
            throw error;
        }
    } else {
        throw new Error(result.message);
    }
}

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

export const addNewClass = async (
    newClass: Class
) => {
    const endpoint = `${import.meta.env.VITE_API_ENDPOINT}/class/add_class.php`
    const API_KEY = import.meta.env.VITE_TEACHER_APIKEY as string

    const body = JSON.stringify({
        teacher_id: newClass.teacherID,
        name: newClass.name,
        admission_year: newClass.admissionYear,
        major_code: newClass.majorCode
    });

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: API_KEY,
        },
        body,
    });

    const result = await response.json() as { status: "success" | "error", message: string };

    if (result.status === "success") {
        console.log("✅ クラス追加成功。");
    } else {
        throw new Error(result.message);
    }
}