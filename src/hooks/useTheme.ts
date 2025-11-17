import { useState, useEffect } from "react";
import { applyTheme } from "@/theme.js";

export type ThemeMode = "light" | "dark" | "system";

export const useTheme = () => {
	const [currentTheme, setCurrentTheme] = useState<ThemeMode>(() => {
		const saved = localStorage.getItem("theme");
		if (saved === "light" || saved === "dark") {
			return saved;
		}
		return "system";
	});

	const [isDark, setIsDark] = useState<boolean>(() => {
		return document.documentElement.classList.contains("dark");
	});

	useEffect(() => {
		// Update isDark state when theme changes
		const observer = new MutationObserver(() => {
			setIsDark(document.documentElement.classList.contains("dark"));
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});

		return () => observer.disconnect();
	}, []);

	const setTheme = (mode: ThemeMode) => {
		if (mode === "system") {
			localStorage.removeItem("theme");
			setCurrentTheme("system");
		} else {
			localStorage.setItem("theme", mode);
			setCurrentTheme(mode);
		}

		// Reapply theme
		applyTheme();
	};

	return { currentTheme, isDark, setTheme };
};
