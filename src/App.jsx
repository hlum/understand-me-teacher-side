import React, {useEffect, useState} from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase/firebase.jsx'
import Login from './components/Login.jsx'

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        })

        return () => unsubscribe();
    }, [])

    const logout = () => signOut(auth);

    return (
        <div>
            { user ? (
                <>
                    <h2>Welcome, { user.displayName }</h2>
                    <img src={user.photoURL} alt="Profile picture" width={50} />
                    <br/>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <Login />
            )
            }
        </div>
    )
}
export default App
