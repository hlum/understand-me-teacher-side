import { type User } from "firebase/auth";

export interface AuthManagerInterface {
	signInWithGoogle(): Promise<User>;
	logOut(): Promise<void>;
	changeAccount(): Promise<void>;
}
