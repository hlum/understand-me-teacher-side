/**
 * Apply theme based on user preference or system preference
 * This function should be called before React mounts to avoid flash
 */
export function applyTheme(): void {
	const saved = localStorage.getItem("theme");

	if (saved === "light" || saved === "dark") {
		if (saved === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
		return;
	}

	// No saved preference → use system preference
	const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	if (systemDark) {
		document.documentElement.classList.add("dark");
	} else {
		document.documentElement.classList.remove("dark");
	}
}

/**
 * Listen to system theme changes and apply them if user hasn't set a manual preference
 */
export function setupThemeListener(): void {
	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

	const handleChange = (e: MediaQueryListEvent) => {
		const saved = localStorage.getItem("theme");
		// Only apply system theme if user hasn't set manual preference
		if (!saved) {
			document.documentElement.classList.toggle("dark", e.matches);
		}
	};

	// Modern browsers
	if (mediaQuery.addEventListener) {
		mediaQuery.addEventListener("change", handleChange);
	} else {
		// Fallback for older browsers
		mediaQuery.addListener(handleChange);
	}
}
