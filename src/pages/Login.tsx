import { signInWithGoogle } from "../api/auth.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleClick = async () => {
        setLoading(true);
        try {
            const user = await signInWithGoogle();
            navigate("/");
        } catch {
            alert("Login 失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.6)] hover:shadow-[0_0_40px_rgba(0,0,0,0.8)] transition-all duration-500 p-10 text-center">
                {/* Header */}
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-8 tracking-wide">
                    Googleでログイン
                </h2>

                {/* Button */}
                <button
                    onClick={handleClick}
                    disabled={loading}
                    className={`relative w-full inline-flex items-center justify-center text-white font-semibold py-3 rounded-lg text-lg transition-all duration-300 ${
                        loading
                            ? "bg-gray-700 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:-translate-y-0.5"
                    }`}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ログイン中...
                        </span>
                    ) : (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2 text-white"
                                viewBox="0 0 48 48"
                            >
                                <path
                                    fill="#FFC107"
                                    d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.5 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10 0 19-7.3 19-20 0-1.2-.1-2.4-.4-3.5z"
                                />
                                <path
                                    fill="#FF3D00"
                                    d="M6.3 14.7l6.6 4.8C14.3 16 18.8 13 24 13c3 0 5.7 1.1 7.8 3l5.7-5.7C34.5 6.5 29.6 4 24 4c-7.4 0-13.8 4.2-17.7 10.7z"
                                />
                                <path
                                    fill="#4CAF50"
                                    d="M24 44c5.3 0 10.2-2 13.8-5.3l-6.4-5.5C29.3 36 27 37 24 37c-5.3 0-9.7-3.6-11.3-8.5l-6.6 5.1C10.2 40.4 16.6 44 24 44z"
                                />
                                <path
                                    fill="#1976D2"
                                    d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.4 4.2-4.4 5.6l6.4 5.5c3.8-3.5 6.3-8.6 6.3-15.1 0-1.2-.1-2.4-.4-3.5z"
                                />
                            </svg>
                            Googleでサインイン
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
export default Login;
