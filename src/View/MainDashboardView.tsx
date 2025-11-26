import { Navigate } from "react-router-dom";
import { useMainDashboardViewModel } from "../ViewModel/MainDashboardViewModel.js";
import { ClassManager } from "../Manager/ClassManager.js";
import { Loading } from "./Components/Loading.js";
import { ThemeToggle } from "./Components/ThemeToggle.js";
import { useRouteManager } from "../Router/useRouteManager.js";
import type { User } from "firebase/auth";
import { UserManager } from "@/Manager/UserManager.js";
import { ProfileMenu } from "./Components/ProfileMenu.js";

type MainDashboardViewProps = {
	authData: User;
};

const MainDashboardView = ({ authData }: MainDashboardViewProps) => {
	const classManager = new ClassManager();
	const userManager = new UserManager();
	const navigate = useRouteManager();
	const vm = useMainDashboardViewModel(userManager, classManager, authData);

	if (vm.loading) {
		return <Loading />;
	}

	return (
		<div className="page-bg p-8">
			{/* Header Section */}
			<div className="flex flex-wrap justify-between items-center mb-10 gap-6">
				<h1 className="text-3xl sm:text-4xl font-bold text-adaptive">
					クラス管理、
					<span className="text-accent-light">{vm.user?.name}</span>
				</h1>

				<div className="flex items-center gap-4">
					<ThemeToggle />
					<ProfileMenu photoURL={vm.user?.photoURL ?? ""} name={vm.user?.name ?? ""} onLogout={() => {}} />
					<button onClick={() => navigate.toCreateClass()} className="btn-primary">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
						</svg>
						クラスを追加
					</button>
				</div>
			</div>

			{/* Class List Section */}
			{vm.classes.length === 0 ? (
				<div className="flex justify-center items-center py-24 text-center">
					<p className="text-gray-400 text-lg">担当しているクラスがありません。</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{vm.classes.map((cls) => (
						<div key={cls.id} onClick={() => navigate.toClassDetail(cls.id)} className="card-hover">
							<div className="flex justify-between items-start mb-4">
								<h2 className="text-lg font-semibold text-adaptive hover:text-primary-light transition-colors">{cls.name}</h2>
							</div>

							<div className="flex flex-wrap gap-2">
								{/* Year Badge */}
								<span className="badge-blue">
									<span className="opacity-70 text-xs">第</span>
									{cls.admissionYear}
									<span className="opacity-70 text-xs">年度</span>
								</span>

								{/* Major Badge */}
								<span className="badge-green">{cls.majorCode.toUpperCase()}</span>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export { MainDashboardView };
