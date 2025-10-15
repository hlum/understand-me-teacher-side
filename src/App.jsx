import React, {useEffect, useState} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from "./firebase/firebase.jsx";
import Login from './components/Login.jsx'
import {logOut} from "./api/auth.jsx";
import ApiKeyInput from "./components/ApiKeyInput.jsx";

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        })

        return () => unsubscribe();
    }, [])

    return (
        <div>
            { user ? (
                <ApiKeyInput user={user} />
            ) : (
                // Loginしているユーザーがない
                <Login />
            )
            }
        </div>
    )
}
export default App
