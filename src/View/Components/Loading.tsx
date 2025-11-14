export const Loading = () => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
			<div className="relative flex flex-col items-center">
				<div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
				<h2 className="mt-6 text-2xl font-semibold tracking-wide text-blue-400 animate-pulse">ローディング中...</h2>
				<p className="text-gray-400 mt-2">少々お待ちください</p>
			</div>
		</div>
	);
};
