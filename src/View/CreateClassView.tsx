import { useCreateClassViewModel } from "../ViewModel/CreateClassViewModel.js";
import { ClassManager } from "../Manager/ClassManager.js";
import { Loading } from "./Components/Loading.js";
import { useRouteManager } from "../Router/useRouteManager.js";
import type { User } from "firebase/auth";

type CreateClassViewProps = {
	authData: User;
};

const CreateClassView = (props: CreateClassViewProps) => {
	const { authData } = props;
	const classManager = new ClassManager();
	const vm = useCreateClassViewModel(classManager, authData);

	if (vm.loading) {
		return <Loading />;
	}

	return (
		<div className="page-bg-auth flex items-center justify-center px-6 py-12">
			<div className="w-full max-w-2xl card-auth p-10">
				{/* Header */}
				<h1 className="text-4xl font-bold text-center text-white mb-10 tracking-wide">クラスを追加</h1>

				{/* クラス名 */}
				<div className="mb-8">
					<label className="block text-gray-300 font-medium mb-2">クラス名</label>
					<input
						type="text"
						placeholder="例: iOS開発クラス"
						value={vm.className}
						onChange={(event) => {
							vm.setClassName(event.target.value);
							vm.checkClassName(event.target.value);
						}}
						className={`input ${vm.errors.className ? "input-error" : ""}`}
					/>
					{vm.errors.className && <p className="text-red-500 text-sm mt-2">{vm.errors.className}</p>}
				</div>

				{/* 入学年度 */}
				<div className="mb-8">
					<label className="block text-gray-300 font-medium mb-2">対象の入学年度 </label>
					<input
						type="number"
						placeholder="例: 23"
						value={vm.admissionYear}
						onChange={(event) => {
							vm.setAdmissionYear(event.target.value);
							vm.checkAdmissionYear(event.target.value);
						}}
						className={`input ${vm.errors.admissionYear ? "input-error" : ""}`}
					/>
					{vm.errors.admissionYear && <p className="text-red-500 text-sm mt-2">{vm.errors.admissionYear}</p>}
				</div>

				{/* 専攻コード */}
				<div className="mb-10">
					<label className="block text-gray-300 font-medium mb-2">専攻コード</label>
					<input
						type="text"
						placeholder="例: cm, ap, ac"
						value={vm.majorCode}
						onChange={(event) => vm.setMajorCode(event.target.value)}
						className="input"
					/>
					{vm.errors.majorCode && <p className="text-red-500 text-sm mt-2">{vm.errors.majorCode}</p>}
				</div>

				{/* ボタン */}
				<button
					onClick={vm.handleSubmit}
					disabled={vm.errors.className === null || vm.errors.admissionYear === null}
					className={`w-full py-3 rounded-lg font-semibold text-lg tracking-wide transition-all duration-300 ${
						vm.errors.className || vm.errors.admissionYear ? "btn-disabled" : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] hover:-translate-y-0.5"
					}`}
				>
					クラスを追加する
				</button>
			</div>
		</div>
	);
};

export default CreateClassView;
