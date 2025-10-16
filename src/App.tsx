import React, {useEffect, useState} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from "./firebase/firebase.js";
import type { User } from "firebase/auth";
import {userAlreadyExistsInDB} from "./api/user.js";
import {logOut} from "./api/auth.js";
import ApiKeyCheckBeforeRegistration from "./components/ApiKeyCheckBeforeRegistration.js";
import Login from "./components/Login.js";
import { MainDashboardView } from "./components/MainDashboardView.js";

const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userExists, setUserExists] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        })

        return () => unsubscribe();
    }, [])

    useEffect(() => {
        const checkUserExists = async () => {
            if (!user?.uid) return;
            const exists = await userAlreadyExistsInDB(user.uid);
            setUserExists(exists);
        };
        checkUserExists();
    }, [user?.uid]);

    const logout = () => logOut();

        return (
        <div>
            {user ? (
                userExists ? (
                    <>
                        {/* Login終わって, DBにユーザーが存在する場合 */}
                       <MainDashboardView user={user}/>
                    </>
                ) : (
                    <>
                        {/* Login終わって, DBにユーザーが存在しない場合 */}
                        <ApiKeyCheckBeforeRegistration user={user} setUserExists={setUserExists} />
                    </>
                )
            ) : (
                <>
                    {/* Loginしているユーザーがない */}
                    <Login/>
                </>
            )}
        </div>
    )
}
export default App
