import { APIError, NetworkError, DataParseError, AuthenticationError } from "./CustomErrors.js";

/**
 * アプリケーション全体のエラーを処理し、ユーザー向けの安全なメッセージを返す
 * 開発者向けの詳細情報は console.error() に出力される
 * @param error キャッチされたエラーオブジェクト
 * @returns ユーザーに表示する安全なエラーメッセージ
 */
export function handleAppError(error: unknown): string {
	// 開発者向けログ出力
	console.error("⛔ Internal Error:", error);

	if (error instanceof NetworkError) {
		return "通信エラーが発生しました。ネットワークを確認してください。";
	}

	if (error instanceof DataParseError) {
		return "サーバーのデータ処理中に問題が発生しました。";
	}

	if (error instanceof AuthenticationError) {
		return "認証に失敗しました。もう一度お試しください。";
	}

	if (error instanceof APIError) {
		// API の errorCode をユーザー向け文言に変換
		switch (error.errorCode) {
			case "VALIDATION_ERROR":
				// バリデーションエラーはユーザーの入力ミスなので、詳細を表示
				return error.message;
			case "NOT_FOUND":
				return "対象データが見つかりませんでした。";
			case "UNAUTHORIZED":
				return "ログインが必要です。";
			case "FORBIDDEN":
				return "この操作を実行する権限がありません。";
			case "CONFLICT":
				return "データの競合が発生しました。最新の情報を確認してください。";
			case "INTERNAL_SERVER_ERROR":
				return "サーバー側で問題が発生しました。時間を置いて再度お試しください。";
			default:
				return "サーバー側で問題が発生しました。時間を置いて再度お試しください。";
		}
	}

	// fallback: 予期しないエラー
	return "エラーが発生しました。もう一度お試しください。";
}
