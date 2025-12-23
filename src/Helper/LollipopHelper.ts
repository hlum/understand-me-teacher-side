import type { LollipopResponse } from "../Entity/LollipopResponse.js";
import { APIError, DataParseError, NetworkError } from "./CustomErrors.js";

export class LollipopHelper {
	public static readonly instance = new LollipopHelper();
	private constructor() {}

	/**
	 *
	 * @param endpoint
	 * @param context エラーログ用のコンテキスト情報
	 * @param options fetchのオプション
	 * @returns LollipopからのResponseをデコードしたもの
	 * @throws NetworkError, DataParseError
	 */
	async fetchAndDecodeLollipopResponse<T>(endpoint: string, context: string, options: RequestInit): Promise<LollipopResponse<T>> {
		let response: Response;

		// ネットワークリクエストの実行
		try {
			response = await fetch(endpoint, options);
		} catch (error) {
			throw new NetworkError(`${context} ネットワークエラー: ${error}`);
		}

		// ---- ここを改善 ----
		const rawText = await response.text(); // ← 生レスポンスを読む

		try {
			const json = JSON.parse(rawText);
			return json as LollipopResponse<T>;
		} catch (error) {
			// 生レスポンスをエラーメッセージに含める
			throw new DataParseError(`${context} Lollipopレスポンスのデコードに失敗しました。\nRaw Response:\n${rawText}\nError: ${error}`);
		}
	}

	/**
	 * Lollipopレスポンスの検証(response.statusが"success"であることを確認)
	 * @param response LollipopからのResponse
	 * @param context エラーログ用のコンテキスト情報
	 * @param requireData LollipopからのResponseの中にデータの存在を必須とするかどうか
	 * @throws APIError, DataParseError
	 */
	validateLollipopResponse<T>(response: LollipopResponse<T>, context: string): void {
		if (response.status !== "success") {
			// errorCode がある場合はそれを使用、なければ UNKNOWN
			const errorCode = response.errorCode || "UNKNOWN";
			throw new APIError(`${context} APIエラー: ${response.message}`, errorCode);
		}
	}

	/**
	 * APIエンドポイントの構築
	 * @param path APIのパス
	 * @param params クエリパラメータのオブジェクト
	 * @returns 完全なAPIエンドポイントURL
	 */
	buildEndpoint(path: string, params: Record<string, string>): string {
		const baseURL = import.meta.env.VITE_API_ENDPOINT;
		const searchParams = new URLSearchParams(params);
		return `${baseURL}${path}?${searchParams.toString()}`;
	}

	buildHeader(forTeacher: boolean = false): Headers {
		const headers = new Headers();
		headers.append("Content-Type", "application/json");
		const apiKey = forTeacher ? (import.meta.env.VITE_TEACHER_APIKEY as string) : (import.meta.env.VITE_API_KEY as string);
		headers.append("Authorization", apiKey);
		return headers;
	}
}
