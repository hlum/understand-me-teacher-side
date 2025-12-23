import { transformUserEntityResponse, type RawUserEntityResponse, type UserEntity } from "../Entity/UserEntity.js";
import { LollipopHelper } from "../Helper/LollipopHelper.js";
import type { UserManagerInterface } from "../ManagerInterface/UserManagerInterface.js";

export class UserManager implements UserManagerInterface {
	async registerTeacher(id: string, email: string, name: string, photoURL: string): Promise<void> {
		const endPoint = LollipopHelper.instance.buildEndpoint("/user/register_teacher.php", {});
		const headers = LollipopHelper.instance.buildHeader(true);

		const body = JSON.stringify({
			id,
			email,
			name,
			role: "teacher",
			photo_url: photoURL,
		});

		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse(endPoint, "UserManager.registerTeacher", {
			method: "POST",
			headers: headers,
			body,
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, "UserManager.registerTeacher");

		console.log("✅ User 保存成功。");
	}

	async teacherRecordExists(userID: string): Promise<boolean> {
		const endPoint = LollipopHelper.instance.buildEndpoint("/user/get_user.php", { id: userID });
		const headers = LollipopHelper.instance.buildHeader();

		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse<RawUserEntityResponse[]>(endPoint, "UserManager.userAlreadyExistsInDB", {
			method: "GET",
			headers: headers,
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, "UserManager.userAlreadyExistsInDB");
		if (!lollipopResponse.data) {
			return false;
		}

		const user = lollipopResponse.data.map(transformUserEntityResponse)[0];

		if (!user || user.role !== "teacher") {
			return false;
		}

		return true;
	}

	async fetchUserData(userID: string): Promise<UserEntity> {
		const endPoint = LollipopHelper.instance.buildEndpoint("/user/get_user.php", { id: userID });
		const headers = LollipopHelper.instance.buildHeader();

		const lollipopResponse = await LollipopHelper.instance.fetchAndDecodeLollipopResponse<RawUserEntityResponse[]>(endPoint, "UserManager.fetchUserData", {
			method: "GET",
			headers: headers,
		});

		LollipopHelper.instance.validateLollipopResponse(lollipopResponse, "UserManager.fetchUserData");

		if (!lollipopResponse.data) {
			throw new Error("UserManager.fetchUserData: レスポンスの中にdataが存在しません。");
		}

		const user = lollipopResponse.data.map(transformUserEntityResponse)[0];
		if (!user) {
			throw new Error("UserManager.fetchUserData: ユーザーデータが存在しません。");
		}

		return user;
	}
}
