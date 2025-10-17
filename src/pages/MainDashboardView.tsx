import React, {useEffect, useState} from 'react'
import type {User} from "firebase/auth";
import type { Class } from "../types/class.js";
import { fetchClassList } from "../api/classOperations.js";
import {useNavigate} from "react-router-dom";

type MainDashboardViewProps = {
    user: User
}

const MainDashboardView = ({ user }: MainDashboardViewProps) => {
    const [classes, setClasses] = useState<Class[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = async () => {
            const classList = await fetchClassList(user.uid)
            setClasses(classList)
        }

        fetchClasses()

    }, [])

    return (
        <div className="min-h-screen bg-gray-50 p-6">

            {/* Header Section */}
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                    クラス管理、 <span className="text-green-600">{user.displayName}</span>
                </h1>

                <button
                    onClick={() => navigate("/addNewClassView")}
                    className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
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
                    クラスを追加
                </button>
            </div>

            {/* Class List Section */}
            {classes.length === 0 ? (
                <div className="flex justify-center items-center py-20 text-center">
                    <p className="text-gray-500 text-lg">担当しているクラスがありません。</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls) => (
                        <div
                            key={cls.id}
                            onClick={() => navigate(`/classDetail/${cls.id}`)}
                            className="bg-white border border-gray-200 rounded-2xl p-6 shadow hover:shadow-2xl hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                    {cls.name}
                                </h2>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {/* Year Badge */}
                                <span className="inline-flex items-center gap-1 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 px-3 py-1 rounded-md text-sm font-semibold border border-blue-300">
              <span className="opacity-75 text-xs">第</span>
                                    {cls.admissionYear}
                                    <span className="opacity-75 text-xs">年度</span>
            </span>

                                {/* Major Badge */}
                                <span className="inline-flex items-center gap-1 bg-gradient-to-br from-green-100 to-green-200 text-green-800 px-3 py-1 rounded-md text-sm font-semibold border border-green-300">
              {cls.majorCode}
            </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

    );
}

export { MainDashboardView }