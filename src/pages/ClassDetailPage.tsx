import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import type { Class } from "../types/class.js";
import { fetchClassDetail } from "../api/classOperations.js";
import { fetchHomeworkListForClass } from "../api/HomeworksOperations.js";


export const ClassDetailPage = () => {
    const navigate = useNavigate();
    const { classID } = useParams<{ classID: string }>();
    const [classDetail, setClassDetail] = useState<Class | null>(null);
    const [homeworks, setHomeworks] = useState<Homework[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch class detail
    useEffect(() => {
        const fetchClass = async () => {
            if (!classID) return;
            try {
                const classData = await fetchClassDetail(classID);
                if (!classData) {
                    alert("クラスが見つかりません。");
                    return;
                }
                setClassDetail(classData);
            } catch (error) {
                console.error("Error fetching class detail:", error);
            }
        };
        fetchClass();
    }, [classID]);

    // Fetch homeworks when classDetail is available
    useEffect(() => {
        const fetchHomeworks = async () => {
            if (!classDetail?.id) return;
            try {
                const homeworks = await fetchHomeworkListForClass(classDetail.id);
                setHomeworks(homeworks);
            } catch (error) {
                console.error("Error fetching homeworks:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeworks();
    }, [classDetail]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
                読み込み中です…
            </div>
        );
    }

    if (!classDetail) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500 text-lg">
                クラスが見つかりません。
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">{classDetail.name}</h1>
                <p className="text-gray-500 mt-2">
              <span className="mr-4">
                <strong>Admission Year:</strong> {classDetail.admissionYear}
              </span>
                        <span>
                <strong>Major:</strong> {classDetail.majorCode.toUpperCase()}
              </span>
                </p>
                <button
                    onClick={() =>
                        navigate("/AddNewHomeworkPage", { state: { classID: classDetail.id, teacherID: classDetail?.teacherID } })
                }
                    className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ease-in-out cursor-pointer"
                >
                    {/* Plus Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    課題を追加
                </button>
            </div>

            {/* Homework Section */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Homeworks</h2>

                {homeworks.length === 0 ? (
                    <p className="text-gray-500">このクラスにはまだ課題がありません。</p>
                ) : (
                    <div className="grid gap-4">
                        {homeworks.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border border-gray-200 rounded-2xl p-6 shadow hover:shadow-2xl hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 cursor-pointer"
                            >
                                <h3 className="text-xl font-medium text-gray-800">
                                    {item.title}
                                </h3>
                                {item.description && (
                                    <p className="text-gray-600 mt-1">{item.description}</p>
                                )}
                                {item.dueDate && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        ⏰ Due Date:{" "}
                                        <span className="font-medium">
                      {new Date(item.dueDate).toLocaleDateString()}
                    </span>
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Type
export type Homework = {
    id: string;
    teacherID: string;
    classID: string;
    title: string;
    description: string | null;
    dueDate: string | null;
};
