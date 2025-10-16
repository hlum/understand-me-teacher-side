import React, {useEffect, useState} from 'react'
import type {User} from "firebase/auth";
import type { Class } from "../types/class.js";
import { fetchClassList } from "../api/classOperations.js";
import {useNavigate} from "react-router-dom";

type MainDashboardViewProps = {
    user: User
}

const MainDashboardView = (props: MainDashboardViewProps) => {
    const { user } = props
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
        <div>
            <button>
                <a href="#" onClick={() => navigate("/addNewClassView")}>クラスを追加する</a>
            </button>
            <h1>Welcome {user.displayName}</h1>
            { classes.length === 0 ?

                <p>担当しているクラスがありません。</p>

                :

                classes.map((cls) => {
                    return (
                        <div key={cls.id}>
                            <h2>{cls.name}</h2>
                            <p>Admission Year: {cls.admissionYear}</p>
                            <p>Major Code: {cls.majorCode}</p>
                        </div>
                    )
                })
            }

        </div>
    )
}

export { MainDashboardView }