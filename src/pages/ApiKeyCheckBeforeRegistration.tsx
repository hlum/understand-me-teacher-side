import React, { useState } from "react";
import { saveUser } from "../api/user.js";
import type { User } from "firebase/auth";

type ApiKeyInputProps = {
    user: User;
    setUserExists: (exists: boolean) => void;
}

const ApiKeyCheckBeforeRegistration: React.FC<ApiKeyInputProps> = ({ user, setUserExists }) => {
    const [teacherApiKey, setTeacherApiKey] = useState("");

    const checkTeacherApiKey = async (apiKey: string) => {
        const configTeacherAPIKEY = import.meta.env.VITE_TEACHER_APIKEY;

        if (apiKey === configTeacherAPIKEY) {
            console.log("教師用APIキーが正しいです。");
            try {
                await saveUser(user.uid, user.email ?? "", user.photoURL ?? "", apiKey);
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
        </>
    );
};

export { ApiKeyCheckBeforeRegistration };
