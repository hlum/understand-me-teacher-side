import { useState } from "react";

let timeout: NodeJS.Timeout;

type ProfileMenuProps = {
	photoURL: string;
	name: string;
	onLogout: () => void;
};

export const ProfileMenu = ({ photoURL, name, onLogout }: ProfileMenuProps) => {
	const [open, setOpen] = useState(false);

	return (
		<div
			className="relative inline-block"
			onMouseEnter={() => {
				setOpen(true);
				clearTimeout(timeout);
			}}
			onMouseLeave={() => {
				timeout = setTimeout(() => setOpen(false), 150);
			}}
		>
			<img src={photoURL} alt={`${name}のプロフィール画像`} className="w-12 h-12 rounded-full border cursor-pointer hover:opacity-90" />

			{open && (
				<div className="absolute right-0 top-full mt-2 w-48 card rounded-xl p-2 animate-fade-in z-50">
					<button className="w-full text-left px-3 py-2 text-adaptive-secondary hover-bg-menu hover-text-accent rounded-lg transition">アカウント切り替え</button>
					<hr className="my-2 border-gray-300 dark:border-white/10" />
					<button className="w-full text-left px-3 py-2 text-adaptive-secondary hover-bg-menu hover-text-primary rounded-lg transition" onClick={onLogout}>
						ログアウト
					</button>
				</div>
			)}
		</div>
	);
};
