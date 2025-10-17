import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase.js";
import type { User } from "firebase/auth";
import { userAlreadyExistsInDB } from "./api/user.js";
import { logOut } from "./api/auth.js";
import Login from "./pages/Login.js";
import { MainDashboardView } from "./pages/MainDashboardView.js";
import { Routes, Route } from "react-router-dom";
import { ApiKeyCheckBeforeRegistration } from "./pages/ApiKeyCheckBeforeRegistration.js";
import { ProtectedRoute } from "./components/ProtectedRoute.js";
import AddNewClassView from "./pages/AddNewClassView.js";
import {ClassDetailPage} from "./pages/ClassDetailPage.js";
import {AddNewHomeworkPage} from "./pages/AddNewHomeworkPage.js";

const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userExists, setUserExists] = useState(false);
    const [loading, setLoading] = useState(true); // 👈 Add loading state

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser?.uid) {
                const exists = await userAlreadyExistsInDB(currentUser.uid);
                setUserExists(exists);
            }

            setLoading(false); // 👈 done loading
        });

        return () => unsubscribe();
    }, []);

    const logout = () => logOut();

    // 👇 While Firebase is checking the session, show a loader
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route
                path="/"
                element={
                    <ProtectedRoute user={user}>
                        {userExists ? (
                            <MainDashboardView user={user!} />
                        ) : (
                            <ApiKeyCheckBeforeRegistration
                                user={user!}
                                setUserExists={setUserExists}
                            />
                        )}
                    </ProtectedRoute>
                }
            />

            <Route
                path="/addNewClassView"
                element={
                    <ProtectedRoute user={user}>
                        <AddNewClassView user={user!}/>
                    </ProtectedRoute>
                }
            />

            <Route path="/classDetail/:classID" element={<ClassDetailPage/>}/>

            <Route path="/AddNewHomeworkPage" element={<AddNewHomeworkPage/>}/>
        </Routes>
);
};

export default App;
