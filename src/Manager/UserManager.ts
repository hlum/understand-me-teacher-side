import { transformUserEntityResponse, type RawUserEntityResponse, type UserEntity } from "../Entity/UserEntity.js";
import { DataParseError } from "../Helper/CustomErrors.js";
import { LollipopHelper } from "../Helper/LollipopHelper.js";
import type { UserManagerInterface } from "../ManagerInterface/UserManagerInterface.js";

export class UserManager implements UserManagerInterface {
	async registerTeacher(id: string, email: string, name: string, photoURL: string): Promise<void> {
		const context = "UserManager.registerTeacher";
		const endpoint = LollipopHelper.instance.buildEndpoint("/user/register_teacher.php", {});
		const headers = await LollipopHelper.instance.buildHeaders(true);

		const body = JSON.stringify({
			id,
			email,
			name,
			role: "teacher",
			photo_url: photoURL,
		});

		const response = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endpoint, context, {
			method: "POST",
			headers: headers,
			body,
		});

		LollipopHelper.instance.validateLollipopResponse(response, context);
	}

	async teacherRecordExists(userID: string): Promise<boolean> {
		const context = "UserManager.teacherRecordExists";
		const endpoint = LollipopHelper.instance.buildEndpoint("/user/get_user.php", { id: userID });
		const headers = await LollipopHelper.instance.buildHeaders();

		const response = await LollipopHelper.instance.fetchAndDecodeLollipopResponse<RawUserEntityResponse[]>(endpoint, context, {
			method: "GET",
			headers: headers,
		});

		LollipopHelper.instance.validateLollipopResponse(response, context);

		if (!response.data) {
			return false;
		}

		const user = response.data.map(transformUserEntityResponse)[0];

		return user?.role === "teacher";
	}

	async fetchUserData(userID: string): Promise<UserEntity> {
		const context = "UserManager.fetchUserData";
		const endpoint = LollipopHelper.instance.buildEndpoint("/user/get_user.php", { id: userID });
		const headers = await LollipopHelper.instance.buildHeaders();

		const response = await LollipopHelper.instance.fetchAndDecodeLollipopResponse<RawUserEntityResponse[]>(endpoint, context, {
			method: "GET",
			headers: headers,
		});

		LollipopHelper.instance.validateLollipopResponse(response, context);

		if (!response.data) {
			throw new DataParseError(`${context}: レスポンスの中にdataが存在しません。`);
		}

		const user = response.data.map(transformUserEntityResponse)[0];

		if (!user) {
			throw new DataParseError(`${context}: ユーザーデータが存在しません。`);
		}

		return user;
	}
}
