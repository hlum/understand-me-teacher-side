export type LollipopResponse = {
	status: "success" | "error";
	message: string;
	data: string | null;
	errorCode?: string; // エラーの詳細コード (オプショナル)
};
