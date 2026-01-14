import { LucideChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type ClassFilterDropdownProps<T> = {
	label: string;
	options: T[];
	selectedValue: T | null;
	onSelect: (value: T | null) => void;
	renderOption?: (option: T) => string;
};

export const ClassFilterDropdown = <T extends string | number | boolean>({
	label,
	options,
	selectedValue,
	onSelect,
	renderOption,
}: ClassFilterDropdownProps<T>) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// クリック外で閉じる
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const displayValue = selectedValue !== null ? (renderOption ? renderOption(selectedValue) : String(selectedValue)) : "すべて";

	return (
		<div ref={dropdownRef} className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 px-4 py-2 card text-adaptive text-sm font-medium hover:shadow-lg transition-all"
			>
				<span className="text-adaptive-secondary">{label}:</span>
				<span>{displayValue}</span>
				<LucideChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
			</button>

			{isOpen && (
				<div className="absolute top-full left-0 mt-2 w-48 card-secondary rounded-xl p-2 z-30 animate-fade-in">
					<button
						className={`w-full text-left px-3 py-2 rounded-lg transition hover-bg-menu ${
							selectedValue === null ? "font-extrabold text-primary bg-menu" : "text-adaptive"
						}`}
						onClick={() => {
							onSelect(null);
							setIsOpen(false);
						}}
					>
						すべて
						{selectedValue === null && <span className="float-right text-primary">●</span>}
					</button>
					{options.map((option, index) => {
						const isSelected = selectedValue === option;
						const displayText = renderOption ? renderOption(option) : String(option);
						return (
							<button
								key={index}
								className={`w-full text-left px-3 py-2 rounded-lg transition hover-bg-menu ${
									isSelected ? "font-extrabold text-primary bg-menu" : "text-adaptive"
								}`}
								onClick={() => {
									onSelect(option);
									setIsOpen(false);
								}}
							>
								{displayText}
								{isSelected && <span className="float-right text-primary">●</span>}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};
