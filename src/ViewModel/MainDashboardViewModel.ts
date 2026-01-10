import { useState, useEffect, useMemo } from "react";
import type { ClassManagerInterface } from "../ManagerInterface/ClassManagerInterface.js";
import { handleAppError } from "../Helper/handleAppError.js";
import type { Class } from "../Entity/Class.js";
import type { User } from "firebase/auth";
import type { UserEntity } from "@/Entity/UserEntity.js";
import type { UserManagerInterface } from "@/ManagerInterface/UserManagerInterface.js";
import type { AuthManagerInterface } from "@/ManagerInterface/AuthManagerInterface.js";

export type ClassFilters = {
	admissionYear: number | null;
	majorCode: string | null;
	hasClassCode: boolean | null; // true = has class, false = no class, null = all
};

export const useMainDashboardViewModel = (userManager: UserManagerInterface, classManager: ClassManagerInterface, authManager: AuthManagerInterface, authData: User) => {
	const [classes, setClasses] = useState<Class[]>([]);
	const [user, setUser] = useState<UserEntity | null>(null);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [filters, setFilters] = useState<ClassFilters>({
		admissionYear: null,
		majorCode: null,
		hasClassCode: null,
	});

	useEffect(() => {
		const fetchClasses = async () => {
			try {
				setLoading(true);
				const classList = await classManager.fetchClassesForTeacher(authData.uid);
				setClasses(classList);
			} catch (error: unknown) {
				alert(handleAppError(error));
			} finally {
				setLoading(false);
			}
		};
		fetchClasses();
	}, [authData]);

	// Userのデータを取得
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				setLoading(true);
				const userData = await userManager.fetchUserData(authData.uid);
				setUser(userData);
			} catch (error) {
				alert(handleAppError(error));
			} finally {
				setLoading(false);
			}
		};
		fetchUserData();
	}, [authData]);

	// フィルターオプションを抽出
	const filterOptions = useMemo(() => {
		const years = [...new Set(classes.map((c) => c.admissionYear))].sort((a, b) => b - a);
		const majors = [...new Set(classes.map((c) => c.majorCode))].sort();
		return { years, majors };
	}, [classes]);

	// フィルタリングされたクラス一覧
	const filteredClasses = useMemo(() => {
		return classes.filter((cls) => {
			// 検索クエリでフィルタ
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				const matchesName = cls.name.toLowerCase().includes(query);
				const matchesMajor = cls.majorCode.toLowerCase().includes(query);
				const matchesYear = cls.admissionYear.toString().includes(query);
				if (!matchesName && !matchesMajor && !matchesYear) return false;
			}

			// 入学年度でフィルタ
			if (filters.admissionYear !== null && cls.admissionYear !== filters.admissionYear) {
				return false;
			}

			// 学科コードでフィルタ
			if (filters.majorCode !== null && cls.majorCode !== filters.majorCode) {
				return false;
			}

			// クラスコードの有無でフィルタ
			if (filters.hasClassCode !== null) {
				const hasClass = cls.classCode !== null && cls.classCode !== "";
				if (filters.hasClassCode !== hasClass) return false;
			}

			return true;
		});
	}, [classes, searchQuery, filters]);

	const logOut = async () => {
		await authManager.logOut();
	};

	const changeAccount = async () => {
		await authManager.changeAccount();
	};

	return {
		classes: filteredClasses,
		allClasses: classes,
		loading,
		authData,
		user,
		logOut,
		changeAccount,
		searchQuery,
		setSearchQuery,
		filters,
		setFilters,
		filterOptions,
	};
};
