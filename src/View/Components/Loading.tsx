export const Loading = () => {
	return (
		<div className="loading-page">
			<div className="relative flex flex-col items-center">
				<div className="spinner"></div>
				<h2 className="mt-6 text-2xl font-semibold tracking-wide text-primary-light animate-pulse">ローディング中...</h2>
				<p className="text-gray-400 mt-2">少々お待ちください</p>
			</div>
		</div>
	);
};
