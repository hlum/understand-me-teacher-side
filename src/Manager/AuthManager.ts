import { auth, provider } from "../firebase/firebase.js";
import { signInWithPopup } from "firebase/auth";
import { type User } from "firebase/auth";
import { type AuthManagerInterface } from "../ManagerInterface/AuthManagerInterface.js";
import { AuthenticationError } from "../Helper/CustomErrors.js";

export class AuthManager implements AuthManagerInterface {
	async signInWithGoogle(): Promise<User> {
		try {
			const result = await signInWithPopup(auth, provider);
			return result.user;
		} catch (error) {
			throw new AuthenticationError("AuthManager.signInWithGoogle Googleサインインに失敗しました。" + error);
		}
	}

	async logOut(): Promise<void> {
		try {
			await auth.signOut();
		} catch (error) {
			throw new AuthenticationError("AuthManager.logOut ログアウトに失敗しました。" + error);
		}
	}
}
