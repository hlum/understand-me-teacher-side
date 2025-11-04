import React, { useState } from "react";
import type { User } from "firebase/auth";

type NameInputPageProps = {
    user: User;
    apiKey: string;
    onNameSubmit: (name: string) => void;
};

const NameInputPage: React.FC<NameInputPageProps> = ({
    user,
    apiKey,
    onNameSubmit,
}) => {
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        if (!name.trim()) {
            alert("名前を入力してください。");
            return;
        }
        setIsSubmitting(true);
        onNameSubmit(name.trim());
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.6)] hover:shadow-[0_0_40px_rgba(0,0,0,0.8)] transition-all duration-500 p-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-3 tracking-wide">
                        ようこそ！
                    </h2>
                    <p className="text-gray-300 text-sm">
                        アカウント登録を完了するために、お名前を入力してください
                    </p>
                </div>

                {/* Name Input */}
                <div className="mb-6">
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-300 mb-2"
                    >
                        お名前
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="山田 太郎"
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !isSubmitting) {
                                handleSubmit();
                            }
                        }}
                    />
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`w-full inline-flex items-center justify-center text-white font-semibold py-3 rounded-lg text-lg transition-all duration-300 ${
                        isSubmitting
                            ? "bg-gray-700 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:-translate-y-0.5"
                    }`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            登録中...
                        </span>
                    ) : (
                        "登録する"
                    )}
                </button>

                {/* User Info Display */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                    <p className="text-xs text-gray-400 text-center">
                        登録メールアドレス: {user.email}
                    </p>
                </div>
            </div>
        </div>
    );
};

export { NameInputPage };
