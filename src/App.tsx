import React, {useEffect, useState} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from "./firebase/firebase.js";
import Login from './components/Login.js'
import ApiKeyInput from "./components/ApiKeyInput.js";
import type { User } from "firebase/auth";

const App = () => {
    const [user, setUser] = useState<User | null>(null);

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
