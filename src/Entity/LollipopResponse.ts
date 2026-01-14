export type LollipopResponse<T> = {
	status: "success" | "error";
	message: string;
	data: T | null;
	errorCode?: string; // エラーの詳細コード (オプショナル)
};
