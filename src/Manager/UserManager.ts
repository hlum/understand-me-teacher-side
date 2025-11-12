/**
 * ユーザーデータをLollipopサーバーに保存（新規ユーザーのみ）
 * @param id - Firebase Auth の UUID
 * @param email - ユーザーのメールアドレス
 * @param name - ユーザーの名前
 * @param photoURL - プロフィール写真のURL
 * @param apiKey - 教師専用の API キー
 */
export const saveUser = async (
	id: string,
	email: string,
	name: string,
	photoURL: string,
	apiKey: string
): Promise<void> => {
	const endpoint = `${
		import.meta.env.VITE_API_ENDPOINT
	}/user/register_teacher.php`;

	try {
		const body = JSON.stringify({
			id,
			email,
			name,
			role: "teacher",
			photoURL,
		});

		const response = await fetch(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: apiKey,
			},
			body,
		});

		const result = (await response.json()) as {
			status: "success" | "error";
			message: string;
		};

		if (result.status === "success") {
			console.log("✅ User 保存成功。");
		} else {
			console.error("❌ User 保存失敗:", result.message);
		}
	} catch (error) {
		console.error("❌ ユーザー保存に失敗しました:", error);
		throw error;
	}
};

/**
 * ユーザーがすでにデータベースに存在するかを確認
 * @param userID - Firebase Auth の UUID
 * @returns ユーザーが存在する場合 true、存在しない場合 false
 */
export const userAlreadyExistsInDB = async (
	userID: string
): Promise<boolean> => {
	const baseURL = `${import.meta.env.VITE_API_ENDPOINT}/user/get_user.php`;
	const API_KEY = import.meta.env.VITE_API_KEY as string;

	const params = new URLSearchParams({ id: userID });
	const endpoint = `${baseURL}?${params.toString()}`;

	try {
		const response = await fetch(endpoint, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: API_KEY,
			},
		});

		const result = (await response.json()) as { data: string | null };
		if (!result.data) return false;

		let decodedData: { role: string }[];

		try {
			decodedData = JSON.parse(result.data) as { role: string }[];
			if (!Array.isArray(decodedData) || decodedData.length === 0)
				return false;
			const firstUser = decodedData[0];
			if (!firstUser || !firstUser.role) return false;
			return firstUser.role === "teacher";
		} catch (e) {
			console.error("❌ JSON decoded error:", e);
			return false;
		}
	} catch (error) {
		console.error("❌ ユーザー存在確認に失敗:", error);
		return false;
	}
};
