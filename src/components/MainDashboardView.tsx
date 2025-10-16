import React, {useEffect, useState} from 'react'
import type {User} from "firebase/auth";
import type { Class } from "../types/class.js";
import { fetchClassList } from "../api/classOperations.js";

type MainDashboardViewProps = {
    user: User
}

const MainDashboardView = (props: MainDashboardViewProps) => {
    const { user } = props
    const [classes, setClasses] = useState<Class[]>([])

    useEffect(() => {
        const fetchClasses = async () => {
            const classList = await fetchClassList(user.uid)
            setClasses(classList)
        }

        fetchClasses()

    }, [])

    return (
        <div>
            <h1>Welcome {user.displayName}</h1>
            { classes.length === 0 ?

                <p>No classes available.</p>

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