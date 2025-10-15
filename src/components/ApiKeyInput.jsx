import React, {useEffect, useState} from 'react';
import {saveUser, userAlreadyExistsInDB } from "../api/user.jsx";
import {logOut} from "../api/auth.jsx";

/**
 *
 * @param user - FirebaseのAuthDataResult
 * @param user.displayName - ユーザーの表示名
 * @param {string} user.uid - Firebase AuthのUUID
 * @param {string} user.email - Email アドレス
 * @param {string} user.photoURL - Profile写真
 */
const ApiKeyInput = ({ user }) => {
    const [teacherApiKey, setTeacherApiKey] = useState("");
    const [userExists, setUserExists] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const exists = await userAlreadyExistsInDB(user.uid);
            setUserExists(exists);
        };
        checkUser();
    }, [user.uid]);

    const logout = () => logOut();

    const checkTeacherApiKey = (apiKey) => {
        const configTeacherAPIKEY = import.meta.env.VITE_TEACHER_APIKEY;

        if (apiKey === configTeacherAPIKEY) {
            console.log("教師用APIキーが正しいです。");
            try {
                saveUser(user.uid, user.email, user.photoURL, apiKey);
                setUserExists(true);
            } catch (error) {
                alert("ユーザー情報の保存に失敗しました。");
                console.error("ユーザー情報の保存に失敗しました。", error);
            }
        } else {
            alert("教師用APIキーが間違っています。");
        }
    };


    return (
        <>
        { userExists ? (
            <div>
                <h2>Welcome, { user.displayName }</h2>
                <img src={user.photoURL} alt="Profile picture" width={50} />
                <br/>
                <button onClick={logout}>Logout</button>
            </div>
            ) : (
                <div>
                    <h2>教師用APIキーを入力してください</h2>
                    <input
                        value={teacherApiKey}
                        onChange={(e) => setTeacherApiKey(e.target.value)}
                        placeholder="教師用APIキーを入力してください"
                    />
                    <button onClick={() => checkTeacherApiKey(teacherApiKey)}>
                        検証する
                    </button>
                </div>
            ) }
        </>

    );
};

export default ApiKeyInput;
