import { useMainDashboardViewModel } from "../ViewModel/MainDashboardViewModel.js";
import { ClassManager } from "../Manager/ClassManager.js";
import { Loading } from "./Components/Loading.js";
import { ThemeToggle } from "./Components/ThemeToggle.js";
import { useRouteManager } from "../Router/useRouteManager.js";
import type { User } from "firebase/auth";
import { UserManager } from "@/Manager/UserManager.js";
import { ProfileMenu } from "./Components/ProfileMenu.js";
import { AuthManager } from "@/Manager/AuthManager.js";
import { ClassFilterDropdown } from "./Components/ClassFilterDropdown.js";
import { LucideSearch, LucideX } from "lucide-react";

type MainDashboardViewProps = {
	authData: User;
};

const MainDashboardView = ({ authData }: MainDashboardViewProps) => {
	const classManager = new ClassManager();
	const userManager = new UserManager();
	const navigate = useRouteManager();
	const authManager = new AuthManager();
	const vm = useMainDashboardViewModel(userManager, classManager, authManager, authData);

	if (vm.loading) {
		return <Loading />;
	}

	return (
		<div className="page-bg p-8">
			{/* Header Section */}
			<div className="flex flex-wrap justify-between items-center mb-6 gap-6">
				<h1 className="text-3xl sm:text-4xl font-bold text-adaptive">
					学科管理、
					<span className="text-accent-light">{vm.user?.name}</span>
				</h1>

				<div className="flex items-center gap-4">
					<ThemeToggle />
					<ProfileMenu
						photoURL={vm.user?.photoURL ?? ""}
						onAccountChange={() => {
							vm.changeAccount();
						}}
						onLogout={() => {
							vm.logOut();
							navigate.toLogin();
						}}
					/>
					<button onClick={() => navigate.toCreateClass()} className="btn-primary flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
						</svg>
						学科を追加
					</button>
				</div>
			</div>

			{/* Search and Filter Section */}
			<div className="flex flex-wrap items-center gap-4 mb-8">
				{/* Search Bar */}
				<div className="relative flex-1 min-w-[200px] max-w-md">
					<LucideSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-adaptive-secondary" />
					<input type="text" placeholder="学科名、学科コード、年度で検索..." value={vm.searchQuery} onChange={(e) => vm.setSearchQuery(e.target.value)} className="input pl-10 pr-10" />
					{vm.searchQuery && (
						<button onClick={() => vm.setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-adaptive-secondary hover:text-adaptive transition-colors">
							<LucideX size={18} />
						</button>
					)}
				</div>

				{/* Filters */}
				<div className="flex flex-wrap items-center gap-3">
					<ClassFilterDropdown
						label="年度"
						options={vm.filterOptions.years}
						selectedValue={vm.filters.admissionYear}
						onSelect={(value) => vm.setFilters({ ...vm.filters, admissionYear: value })}
						renderOption={(year) => `${year}年度`}
					/>

					<ClassFilterDropdown
						label="学科"
						options={vm.filterOptions.majors}
						selectedValue={vm.filters.majorCode}
						onSelect={(value) => vm.setFilters({ ...vm.filters, majorCode: value })}
						renderOption={(code) => code.toUpperCase()}
					/>

					<ClassFilterDropdown
						label="科目種別"
						options={[true, false] as boolean[]}
						selectedValue={vm.filters.hasClassCode}
						onSelect={(value) => vm.setFilters({ ...vm.filters, hasClassCode: value })}
						renderOption={(hasClass) => (hasClass ? "選択科目" : "必修科目")}
					/>
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
